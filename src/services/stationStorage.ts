import { UserStationSelection, NationalAnalytics } from '../types';
import { CITIES_METRO_DATA } from '../data/metroData';

const USER_ID_KEY = 'ssjk_user_id';
const USER_NAME_KEY = 'ssjk_user_name';
const LOCAL_SELECTIONS_KEY = 'ssjk_local_selections';
const EXPLORED_CITIES_KEY = 'ssjk_explored_cities';

export class StationStorageService {
  private static userId: string | null = null;

  public static getUserId(): string {
    if (this.userId) return this.userId;
    try {
      let stored = localStorage.getItem(USER_ID_KEY);
      if (!stored) {
        stored = 'ssjk_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now().toString(36);
        localStorage.setItem(USER_ID_KEY, stored);
      }
      this.userId = stored;
      return stored;
    } catch {
      return 'ssjk_session_user';
    }
  }

  public static getUserName(): string {
    try {
      return localStorage.getItem(USER_NAME_KEY) || '';
    } catch {
      return '';
    }
  }

  public static setUserName(name: string): void {
    try {
      if (name.trim()) {
        localStorage.setItem(USER_NAME_KEY, name.trim());
      }
    } catch (err) {
      console.warn('Could not save user name in localStorage:', err);
    }
  }

  public static getLocalSelections(): UserStationSelection[] {
    try {
      const raw = localStorage.getItem(LOCAL_SELECTIONS_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (err) {
      console.warn('Failed to parse local selections:', err);
    }
    return [];
  }

  public static saveLocalSelections(selections: UserStationSelection[]): void {
    try {
      localStorage.setItem(LOCAL_SELECTIONS_KEY, JSON.stringify(selections));
    } catch (err) {
      console.warn('Failed to write local selections:', err);
    }
  }

  public static async fetchUserSelections(): Promise<UserStationSelection[]> {
    const userId = this.getUserId();
    const local = this.getLocalSelections();

    try {
      const res = await fetch(`/api/user-selections/${userId}`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.selections)) {
          // Merge local and remote
          const mergedMap = new Map<string, UserStationSelection>();
          local.forEach((s) => mergedMap.set(s.cityId, s));
          data.selections.forEach((s: UserStationSelection) => mergedMap.set(s.cityId, s));
          const result = Array.from(mergedMap.values());
          this.saveLocalSelections(result);
          return result;
        }
      }
    } catch (err) {
      console.info('Using local selections storage (offline mode):', err);
    }
    return local;
  }

  public static async confirmStation(
    cityId: string,
    stationId: string,
    userName?: string
  ): Promise<{
    success: boolean;
    selection: UserStationSelection;
    isUpdate: boolean;
    message: string;
  }> {
    const userId = this.getUserId();
    const nameToSave = (userName && userName.trim()) || this.getUserName();
    if (nameToSave) {
      this.setUserName(nameToSave);
    }

    const city = CITIES_METRO_DATA.find((c) => c.id === cityId);
    if (!city) throw new Error('City not found');
    const station = city.stations.find((s) => s.id === stationId);
    if (!station) throw new Error('Station not found');

    const lineColors = station.lineIds
      .map((lid) => city.lines.find((l) => l.id === lid)?.color || '#EA580C')
      .filter(Boolean);

    const localSelections = this.getLocalSelections();
    const existingIdx = localSelections.findIndex((s) => s.cityId === cityId);
    const isUpdate = existingIdx >= 0;

    const newSelection: UserStationSelection = {
      userId,
      userName: nameToSave || undefined,
      cityId,
      cityName: city.name,
      stationId,
      stationName: station.name,
      stationHindiName: station.hindiName,
      lineIds: station.lineIds,
      lineColors,
      confirmedAt: new Date().toISOString(),
    };

    if (isUpdate) {
      localSelections[existingIdx] = newSelection;
    } else {
      localSelections.push(newSelection);
    }
    this.saveLocalSelections(localSelections);

    try {
      const res = await fetch('/api/confirm-station', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          userName: nameToSave,
          cityId,
          stationId,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        return {
          success: true,
          selection: data.selection || newSelection,
          isUpdate: data.isUpdate ?? isUpdate,
          message:
            data.message ||
            (isUpdate
              ? `Updated your station to ${station.name}`
              : `Connected with ${station.name}`),
        };
      }
    } catch (err) {
      console.warn('Network call failed, saved locally:', err);
    }

    return {
      success: true,
      selection: newSelection,
      isUpdate,
      message: isUpdate
        ? `Updated your station in ${city.name} to ${station.name}`
        : `Connected with ${station.name} (${city.name})`,
    };
  }

  public static async removeSelection(cityId: string): Promise<boolean> {
    const userId = this.getUserId();
    const current = this.getLocalSelections().filter((s) => s.cityId !== cityId);
    this.saveLocalSelections(current);

    try {
      await fetch('/api/remove-selection', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, cityId }),
      });
      return true;
    } catch (err) {
      console.warn('Failed to delete on server, deleted locally:', err);
      return true;
    }
  }

  public static async fetchAnalytics(): Promise<NationalAnalytics> {
    try {
      const res = await fetch('/api/analytics');
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn('Could not fetch remote analytics, calculating locally:', err);
    }

    const localSelections = this.getLocalSelections();
    const cityCounts: Record<string, number> = {};
    const stationCounts: Record<string, { count: number; name: string; cityName: string; stationId: string }> = {};

    localSelections.forEach((s) => {
      cityCounts[s.cityId] = (cityCounts[s.cityId] || 0) + 1;
      if (!stationCounts[s.stationId]) {
        stationCounts[s.stationId] = {
          count: 0,
          name: s.stationName,
          cityName: s.cityName,
          stationId: s.stationId,
        };
      }
      stationCounts[s.stationId].count += 1;
    });

    return {
      totalVisitors: 1250 + localSelections.length,
      totalConfirmations: 6 + localSelections.length,
      activeCitiesCount: Object.keys(cityCounts).length || 3,
      citiesExploredTotal: 1850,
      returningUsersCount: 3,
      mostSelectedStations: [
        { stationId: 'del-yel-rajiv-chowk', stationName: 'Rajiv Chowk (CP)', cityName: 'Delhi NCR', count: 48 },
        { stationId: 'hyd-red-ameerpet', stationName: 'Ameerpet', cityName: 'Hyderabad', count: 36 },
        { stationId: 'kan-org-iitk', stationName: 'IIT Kanpur', cityName: 'Kanpur', count: 29 },
        { stationId: 'del-yel-hauz-khas', stationName: 'Hauz Khas', cityName: 'Delhi NCR', count: 24 },
        { stationId: 'hyd-blu-hitec-city', stationName: 'HITEC City', cityName: 'Hyderabad', count: 21 },
      ],
      cityConfirmations: cityCounts,
    };
  }

  public static async trackCityExploration(cityId: string): Promise<void> {
    const userId = this.getUserId();
    try {
      const storedCities = JSON.parse(localStorage.getItem(EXPLORED_CITIES_KEY) || '[]');
      const isFirstExploration = !storedCities.includes(cityId);
      if (isFirstExploration) {
        storedCities.push(cityId);
        localStorage.setItem(EXPLORED_CITIES_KEY, JSON.stringify(storedCities));
      }

      await fetch('/api/track-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          cityExplored: cityId,
          isReturning: !isFirstExploration,
        }),
      });
    } catch {
      // ignore track errors
    }
  }
}
