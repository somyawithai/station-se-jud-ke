import { CityMetroNetwork, MetroStation, MetroLine } from '../types';

export interface ValidationIssue {
  severity: 'error' | 'warning';
  cityId: string;
  message: string;
}

export interface ValidationReport {
  isValid: boolean;
  totalStations: number;
  totalLines: number;
  totalCities: number;
  issues: ValidationIssue[];
}

export function validateMetroNetworks(cities: CityMetroNetwork[]): ValidationReport {
  const issues: ValidationIssue[] = [];
  const globalStationIds = new Set<string>();
  let totalStationCount = 0;
  let totalLineCount = 0;

  for (const city of cities) {
    if (!city.id || !city.name || !city.systemName) {
      issues.push({
        severity: 'error',
        cityId: city.id || 'unknown',
        message: `City missing required metadata (id, name, or systemName)`,
      });
    }

    // Check city coordinates
    if (
      !city.centerCoordinates ||
      city.centerCoordinates.length !== 2 ||
      city.centerCoordinates[0] < 6 ||
      city.centerCoordinates[0] > 38 ||
      city.centerCoordinates[1] < 68 ||
      city.centerCoordinates[1] > 98
    ) {
      issues.push({
        severity: 'error',
        cityId: city.id,
        message: `Invalid center coordinates for city ${city.name}: ${JSON.stringify(city.centerCoordinates)}`,
      });
    }

    const stationMap = new Map<string, MetroStation>();
    for (const station of city.stations) {
      totalStationCount++;

      // 1. Check duplicate station IDs
      if (stationMap.has(station.id)) {
        issues.push({
          severity: 'error',
          cityId: city.id,
          message: `Duplicate station ID within city: ${station.id}`,
        });
      }
      stationMap.set(station.id, station);

      if (globalStationIds.has(station.id)) {
        issues.push({
          severity: 'warning',
          cityId: city.id,
          message: `Station ID is reused across cities: ${station.id}`,
        });
      }
      globalStationIds.add(station.id);

      // 2. Check coordinates validity (within India bounds lat: 8-37, lng: 68-98)
      if (
        isNaN(station.latitude) ||
        isNaN(station.longitude) ||
        station.latitude < 8 ||
        station.latitude > 38 ||
        station.longitude < 68 ||
        station.longitude > 98
      ) {
        issues.push({
          severity: 'error',
          cityId: city.id,
          message: `Station ${station.name} (${station.id}) has invalid geographic coordinates [${station.latitude}, ${station.longitude}]`,
        });
      }

      // 3. Check line references
      if (!station.lineIds || station.lineIds.length === 0) {
        issues.push({
          severity: 'error',
          cityId: city.id,
          message: `Station ${station.name} (${station.id}) has no associated lines`,
        });
      }
    }

    // 4. Validate lines
    for (const line of city.lines) {
      totalLineCount++;
      if (!line.id || !line.name || !line.color) {
        issues.push({
          severity: 'error',
          cityId: city.id,
          message: `Line missing essential definition in ${city.name}: ${line.id}`,
        });
      }

      const seenNames = new Set<string>();
      for (const stId of line.stationIds) {
        const st = stationMap.get(stId);
        if (!st) {
          issues.push({
            severity: 'error',
            cityId: city.id,
            message: `Line ${line.name} references non-existent station ID: ${stId}`,
          });
        } else {
          if (seenNames.has(st.name)) {
            issues.push({
              severity: 'warning',
              cityId: city.id,
              message: `Duplicate station name "${st.name}" in line "${line.name}"`,
            });
          }
          seenNames.add(st.name);
        }
      }
    }
  }

  const hasErrors = issues.some((i) => i.severity === 'error');

  return {
    isValid: !hasErrors,
    totalStations: totalStationCount,
    totalLines: totalLineCount,
    totalCities: cities.length,
    issues,
  };
}
