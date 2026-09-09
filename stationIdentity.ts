/**
 * Stable station identities used by schematic layouts.
 *
 * Metro data keeps the source display names because those names are shown in
 * the UI. Layout configuration sometimes uses a shorter or differently
 * punctuated form, so positioning must not depend on exact display strings.
 */
type StationAliasGroup = {
  id: string;
  names: readonly string[];
};

const STATION_ALIAS_GROUPS: Record<string, readonly StationAliasGroup[]> = {
  bengaluru: [
    {
      id: 'nadaprabhu-kempegowda-station-majestic',
      names: [
        'Nadaprabhu Kempegowda Station Majestic',
        'Nadaprabhu Kempegowda station (Majestic)',
      ],
    },
  ],
  mumbai: [
    {
      id: 'bandra-kurla-complex',
      names: ['BKC', 'Bandra Kurla Complex'],
    },
  ],
  hyderabad: [
    {
      id: 'parade-ground',
      names: ['Parade Ground', 'JBS Parade Ground'],
    },
    {
      id: 'mgbs',
      names: ['MGBS (Mahatma Gandhi Bus Station)', 'MG Bus Station'],
    },
  ],
  pune: [
    {
      id: 'pcmc',
      names: ['PCMC', 'PCMC Bhavan'],
    },
  ],
  chennai: [
    {
      id: 'alandur',
      names: ['Alandur', 'Arignar Anna Alandur'],
    },
    {
      id: 'chennai-airport',
      names: ['Chennai Airport', 'Chennai International Airport'],
    },
  ],
  delhi: [
    {
      id: 'raja-nahar-singh-ballabhgarh',
      names: [
        'Raja Nahar Singh (Ballabhgarh)',
        'Raja Nahar Singh Ballabhgarh',
      ],
    },
  ],
};

function normalizeStationName(name: string): string {
  return name
    .toLocaleLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '');
}

/**
 * Returns a stable identity for a station within a city.
 *
 * Explicit aliases handle meaningful abbreviations or prefixes. Normalized
 * names also tolerate harmless differences in case, whitespace, punctuation,
 * and parenthetical formatting without changing the displayed station name.
 */
export function getStationIdentity(cityId: string, stationName: string): string {
  const normalizedName = normalizeStationName(stationName);
  const aliasGroup = STATION_ALIAS_GROUPS[cityId]?.find((group) =>
    group.names.some((name) => normalizeStationName(name) === normalizedName),
  );

  return `${cityId}:${aliasGroup?.id ?? normalizedName}`;
}

export function stationNamesMatch(
  cityId: string,
  firstName: string,
  secondName: string,
): boolean {
  return getStationIdentity(cityId, firstName) === getStationIdentity(cityId, secondName);
}