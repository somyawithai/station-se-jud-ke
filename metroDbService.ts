import { getSupabaseClient, isSupabaseConfigured } from '../lib/supabase';
import { METRO_CITIES } from '../data/metroData';
import { getStationIdentity } from '../utils/stationIdentity';

// ---------------------------------------------------------------------------
// Supabase row shape
// ---------------------------------------------------------------------------
// The `station_selections` table persists ONLY what the app actually collects
// and needs server-side: the visitor's name, which city/station they picked,
// their visibility preference, and an anonymous visitor token used to enforce
// "one station per city per visitor". Line/city metadata (ids, colors, line
// names) is static app data bundled in METRO_CITIES — it is never sent to or
// read from Supabase.
interface StationSelectionRow {
  id: number | string;
  visitor_token: string;
  user_name: string;
  is_public: boolean;
  city_name: string;
  station_name: string;
  created_at: string;
}

// Sentinel used only to satisfy the NOT NULL `user_name` column when a
// visitor leaves the (optional, per the UI) name field blank. Rows with this
// value are never surfaced as a named community profile card.
const ANONYMOUS_NAME = 'Anonymous Commuter';

// ---------------------------------------------------------------------------
// App-facing types
// ---------------------------------------------------------------------------

/**
 * App-facing selection shape used by the UI (Navbar, IndiaMap, App, the
 * station modal). Includes line/city metadata that is NOT stored in
 * Supabase — it's derived locally from METRO_CITIES by city/station name so
 * the rest of the UI can keep working exactly as before.
 */
export interface StationSelectionRecord {
  id?: string;
  visitor_token: string;
  first_name?: string | null;
  is_public?: boolean;
  city_id: string;
  city_name: string;
  station_name: string;
  line_id: string;
  line_name: string;
  line_color: string;
  created_at?: string;
}

export interface PublicCommunityProfile {
  firstName: string;
  createdAt?: string;
}

export interface StationConnectionResult {
  stationName: string;
  cityName: string;
  lineName: string;
  firstName?: string;
  isPublic: boolean;
  connectedCount: number;
  isFirstPerson: boolean;
  savedToSupabase: boolean;
}

// Local storage keys for persistent visitor preferences
const VISITOR_TOKEN_KEY = 'station_sejudke_visitor_id';
const LOCAL_SELECTIONS_KEY = 'station_sejudke_local_selections';
const LOCAL_FIRST_NAME_KEY = 'station_sejudke_first_name';
const LOCAL_VISIBILITY_KEY = 'station_sejudke_is_public';

/**
 * Gets or creates an anonymous persistent visitor UUID for the client
 */
export function getOrCreateVisitorToken(): string {
  let token = localStorage.getItem(VISITOR_TOKEN_KEY);
  if (!token) {
    token = 'vis_' + Math.random().toString(36).substring(2, 15) + '_' + Date.now().toString(36);
    localStorage.setItem(VISITOR_TOKEN_KEY, token);
  }
  return token;
}

/**
 * User saved preferences getters & setters
 */
export function getSavedFirstName(): string {
  return localStorage.getItem(LOCAL_FIRST_NAME_KEY) || '';
}

export function saveFirstName(name: string): void {
  if (name.trim()) {
    localStorage.setItem(LOCAL_FIRST_NAME_KEY, name.trim());
  }
}

export function getSavedVisibility(): boolean {
  const val = localStorage.getItem(LOCAL_VISIBILITY_KEY);
  return val === null ? true : val === 'true';
}

export function saveVisibilityPreference(isPublic: boolean): void {
  localStorage.setItem(LOCAL_VISIBILITY_KEY, isPublic ? 'true' : 'false');
}

/**
 * Gets local station selections map (City ID -> StationSelectionRecord).
 * This is an instant-UI / offline convenience cache for THIS visitor's own
 * pins only. It is never used to source or supplement community data shared
 * across visitors — see getStationCommunity / getTotalConnectedCount below.
 */
export function getLocalStationSelections(): Record<string, StationSelectionRecord> {
  try {
    const raw = localStorage.getItem(LOCAL_SELECTIONS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveLocalStationSelection(record: StationSelectionRecord): void {
  try {
    const current = getLocalStationSelections();
    // Rule: One station per city - this overwrites any existing station in the same city
    current[record.city_id] = record;
    localStorage.setItem(LOCAL_SELECTIONS_KEY, JSON.stringify(current));
  } catch (err) {
    console.error('Failed to save local station selection:', err);
  }
}

function replaceLocalStationSelections(
  selections: Record<string, StationSelectionRecord>,
): void {
  try {
    localStorage.setItem(LOCAL_SELECTIONS_KEY, JSON.stringify(selections));
  } catch (err) {
    console.error('Failed to refresh local station selections:', err);
  }
}

// Clears this visitor's local instant-UI cache entry for a city. This is
// purely tidy-up for the offline convenience cache — it is NOT the source of
// truth for deletion, which always happens against Supabase first (see
// removeStationSelection below).
function removeLocalStationSelection(cityId: string): void {
  try {
    const current = getLocalStationSelections();
    delete current[cityId];
    localStorage.setItem(LOCAL_SELECTIONS_KEY, JSON.stringify(current));
  } catch (err) {
    console.error('Failed to remove local station selection:', err);
  }
}

/**
 * Looks up the static line/city metadata for a given city + station name
 * from the bundled METRO_CITIES dataset. This never touches Supabase — line
 * ids, names, and colors are static network metadata, not user-submitted
 * content, so they're derived locally rather than persisted per-row.
 */
function findStaticStationMeta(
  cityName: string,
  stationName: string
): { cityId: string; lineId: string; lineName: string; lineColor: string } {
  const fallbackCityId = cityName.toLowerCase().replace(/\s+/g, '-');
  const city = METRO_CITIES.find((c) => c.name === cityName || c.id === fallbackCityId);
  const cityId = city?.id || fallbackCityId;

  if (city) {
    const line = city.lines.find((l) => l.stations.includes(stationName));
    if (line) {
      return { cityId, lineId: line.id, lineName: line.name, lineColor: line.colorHex };
    }
  }

  return { cityId, lineId: '', lineName: '', lineColor: '#a8a29e' };
}

/**
 * Stable station key shared by the community-status service and the metro
 * maps. The identity helper keeps legacy aliases and harmless punctuation
 * differences from splitting one station into multiple statuses.
 */
export function getStationConnectionKey(cityId: string, stationName: string): string {
  return getStationIdentity(cityId, stationName);
}

/**
 * Fetches the count of connected people and public community profiles for a
 * station EXCLUSIVELY from Supabase. This is the shared, cross-device source
 * of truth — localStorage is never used to source or supplement this data,
 * so what one visitor submits is what every other visitor/device sees.
 * Strictly guarantees NO private database fields (visitor_token, internal
 * ids) are exposed.
 */
export async function getStationCommunity(
  cityName: string,
  stationName: string
): Promise<{
  totalCount: number;
  publicProfiles: PublicCommunityProfile[];
}> {
  const supabase = getSupabaseClient();

  if (!supabase) {
    console.error(
      '[Station Se Jud Ke] Supabase is not configured — cannot load shared station community data. ' +
      'Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'
    );
    return { totalCount: 0, publicProfiles: [] };
  }

  try {
    // 1. Get exact total count of all connected people (both private & public) for this station
    const { count, error: countError } = await supabase
      .from('station_selections')
      .select('id', { count: 'exact', head: true })
      .eq('city_name', cityName)
      .eq('station_name', stationName);

    if (countError) {
      console.error('[Station Se Jud Ke] Failed to fetch station connection count:', countError.message);
    }

    // 2. Query public profiles only (explicitly select ONLY safe presentation fields)
    const { data: profilesData, error: profilesError } = await supabase
      .from('station_selections')
      .select('user_name, created_at')
      .eq('city_name', cityName)
      .eq('station_name', stationName)
      .eq('is_public', true)
      .neq('user_name', '')
      .neq('user_name', ANONYMOUS_NAME)
      .order('created_at', { ascending: false })
      .limit(30);

    if (profilesError) {
      console.error('[Station Se Jud Ke] Failed to fetch station community profiles:', profilesError.message);
    }

    const publicProfiles: PublicCommunityProfile[] = [];
    if (profilesData) {
      profilesData.forEach((row: any) => {
        if (row.user_name && typeof row.user_name === 'string' && row.user_name.trim()) {
          publicProfiles.push({
            firstName: row.user_name.trim(),
            createdAt: row.created_at,
          });
        }
      });
    }

    return {
      totalCount: countError ? publicProfiles.length : (count ?? 0),
      publicProfiles,
    };
  } catch (err) {
    console.error('[Station Se Jud Ke] Unexpected error fetching station community from Supabase:', err);
    return { totalCount: 0, publicProfiles: [] };
  }
}

/**
 * Saves a station selection to Supabase and local cache.
 * Enforces strictly:
 * - A visitor can select only ONE station per city (upsert on visitor_token + city_name).
 * - A visitor can select stations in MULTIPLE different cities.
 * - Visibility preference: If isPublic is false, the name is not exposed to other visitors.
 */
export async function confirmStationSelection(payload: {
  cityId: string;
  cityName: string;
  stationName: string;
  lineId: string;
  lineName: string;
  lineColor: string;
  firstName?: string;
  isPublic?: boolean;
}): Promise<StationConnectionResult> {
  const visitorToken = getOrCreateVisitorToken();
  const trimmedName = payload.firstName?.trim() || '';
  const isPublic = payload.isPublic ?? true;

  if (trimmedName) {
    saveFirstName(trimmedName);
  }
  saveVisibilityPreference(isPublic);

  const selectionRecord: StationSelectionRecord = {
    visitor_token: visitorToken,
    first_name: trimmedName || null,
    is_public: isPublic,
    city_id: payload.cityId,
    city_name: payload.cityName,
    station_name: payload.stationName,
    line_id: payload.lineId,
    line_name: payload.lineName,
    line_color: payload.lineColor,
  };

  let savedToSupabase = false;
  let liveCount = 0;

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      // Save / update station selection.
      // Uses the unique constraint on (visitor_token, city_name) to guarantee
      // 1 station per city per visitor. Only the fields that actually exist
      // and are collected are sent — no line/city metadata, no social fields.
      const { error: upsertError } = await supabase.from('station_selections').upsert(
        {
          visitor_token: visitorToken,
          user_name: trimmedName || ANONYMOUS_NAME,
          is_public: isPublic,
          city_name: payload.cityName,
          station_name: payload.stationName,
        },
        { onConflict: 'visitor_token,city_name' }
      );

      if (!upsertError) {
        savedToSupabase = true;
        // Keep the local cache as a fallback for this visitor only, but never
        // write it before Supabase confirms the persisted selection.
        saveLocalStationSelection(selectionRecord);
      } else {
        console.error(
          '[Station Se Jud Ke] Failed to save station selection to Supabase — the name was NOT ' +
          'shared with other visitors/devices:',
          upsertError.message
        );
      }

      // Query the fresh accurate total count for this station directly from Supabase
      const { count, error: countError } = await supabase
        .from('station_selections')
        .select('id', { count: 'exact', head: true })
        .eq('city_name', payload.cityName)
        .eq('station_name', payload.stationName);

      if (countError) {
        console.error('[Station Se Jud Ke] Failed to fetch updated station count:', countError.message);
      }

      liveCount = count ?? (savedToSupabase ? 1 : 0);
    } catch (err) {
      console.error('[Station Se Jud Ke] Supabase operation failed:', err);
    }
  } else {
    console.error('[Station Se Jud Ke] Supabase is not configured — selection was not shared.');
  }

  // Determine if this is the first person or has previous connections
  const isFirstPerson = liveCount <= 1;

  return {
    stationName: payload.stationName,
    cityName: payload.cityName,
    lineName: payload.lineName,
    firstName: trimmedName || undefined,
    isPublic,
    connectedCount: liveCount,
    isFirstPerson,
    savedToSupabase,
  };
}

/**
 * Returns all active station selections of the current visitor across all cities.
 * This reflects the current visitor's OWN submissions (read from Supabase by
 * visitor_token), enriched with static line/city metadata for the UI. The
 * local cache is only ever used as a fallback for this visitor's own data
 * when Supabase is unreachable — never as a source of other visitors' data.
 */
export async function getVisitorActiveSelections(): Promise<Record<string, StationSelectionRecord>> {
  const visitorToken = getOrCreateVisitorToken();
  const local = getLocalStationSelections();

  const supabase = getSupabaseClient();
  if (!supabase) {
    return local;
  }

  try {
    const { data, error } = await supabase
      .from('station_selections')
      .select('id, visitor_token, user_name, is_public, city_name, station_name, created_at')
      .eq('visitor_token', visitorToken);

    if (error || !data) {
      return local;
    }

    // A successful Supabase response is authoritative, including an empty
    // response after deletion. Do not merge stale local rows back into it.
    const map: Record<string, StationSelectionRecord> = {};
    data.forEach((row: any) => {
      const meta = findStaticStationMeta(row.city_name, row.station_name);
      map[meta.cityId] = {
        id: String(row.id),
        visitor_token: row.visitor_token,
        first_name: row.user_name === ANONYMOUS_NAME ? null : row.user_name,
        is_public: row.is_public,
        city_id: meta.cityId,
        city_name: row.city_name,
        station_name: row.station_name,
        line_id: meta.lineId,
        line_name: meta.lineName,
        line_color: meta.lineColor,
        created_at: row.created_at,
      };
    });

    // Keep the offline fallback aligned with the last authoritative read so a
    // later network failure cannot resurrect a deleted selection.
    replaceLocalStationSelections(map);
    return map;
  } catch {
    return local;
  }
}

/**
 * Removes the CURRENT visitor's own station connection for one city from
 * Supabase (station_selections). Scoped to (visitor_token, city_name) — the
 * same pair the unique constraint and the save/upsert path use — so this can
 * only ever delete a row that belongs to this visitor. It never deletes by
 * id alone and never touches other visitors' rows.
 */
export async function removeStationSelection(
  record: Pick<StationSelectionRecord, 'city_id' | 'city_name'>
): Promise<boolean> {
  const visitorToken = getOrCreateVisitorToken();
  const supabase = getSupabaseClient();

  if (!supabase) {
    console.error('[Station Se Jud Ke] Supabase is not configured — cannot remove station selection.');
    return false;
  }

  try {
    const { error } = await supabase
      .from('station_selections')
      .delete()
      .eq('visitor_token', visitorToken)
      .eq('city_name', record.city_name);

    if (error) {
      console.error('[Station Se Jud Ke] Failed to remove station selection from Supabase:', error.message);
      return false;
    }

    // Only clear the local instant-UI cache after the Supabase delete succeeds.
    removeLocalStationSelection(record.city_id);
    return true;
  } catch (err) {
    console.error('[Station Se Jud Ke] Unexpected error removing station selection:', err);
    return false;
  }
}

/**
 * Returns the set of city ids that have AT LEAST ONE community connection
 * (from any visitor, not just the current one). Sourced live from Supabase
 * so every visitor's browser sees the same "Connected" cities on the map —
 * this is what makes a saved connection visible to all users, not only the
 * person who saved it. Only city_name is read (already public per the
 * "Allow public read station selections" policy), never visitor_token or
 * user_name, since this is purely a presence indicator.
 */
export async function getCommunityConnectedCityIds(): Promise<Set<string>> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return new Set();
  }

  try {
    const { data, error } = await supabase
      .from('station_selections')
      .select('city_name');

    if (error || !data) {
      console.error('[Station Se Jud Ke] Failed to fetch community-connected cities:', error?.message);
      return new Set();
    }

    const cityIds = new Set<string>();
    data.forEach((row: any) => {
      if (row.city_name) {
        const meta = findStaticStationMeta(row.city_name, '');
        cityIds.add(meta.cityId);
      }
    });
    return cityIds;
  } catch (err) {
    console.error('[Station Se Jud Ke] Unexpected error fetching community-connected cities:', err);
    return new Set();
  }
}

/**
 * Returns stable keys for every station with at least one persisted community
 * connection. Only city_name and station_name are selected; visitor tokens,
 * names, and visibility fields never leave this service.
 */
export async function getCommunityConnectedStationKeys(): Promise<Set<string>> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return new Set();
  }

  try {
    const { data, error } = await supabase
      .from('station_selections')
      .select('city_name, station_name');

    if (error || !data) {
      console.error('[Station Se Jud Ke] Failed to fetch community-connected stations:', error?.message);
      return new Set();
    }

    const stationKeys = new Set<string>();
    data.forEach((row: any) => {
      if (row.city_name && row.station_name) {
        const meta = findStaticStationMeta(row.city_name, row.station_name);
        stationKeys.add(getStationConnectionKey(meta.cityId, row.station_name));
      }
    });
    return stationKeys;
  } catch (err) {
    console.error('[Station Se Jud Ke] Unexpected error fetching community-connected stations:', err);
    return new Set();
  }
}

/**
 * Gets the total number of active station connections platform-wide, for
 * the homepage "People Connected" stat. This is shared community data, so it
 * is read EXCLUSIVELY from Supabase — it never falls back to a localStorage
 * estimate when Supabase is unavailable or the query fails.
 */
export async function getTotalConnectedCount(): Promise<number> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    console.error('[Station Se Jud Ke] Supabase is not configured — cannot load the platform-wide connected count.');
    return 0;
  }

  try {
    const { count, error } = await supabase
      .from('station_selections')
      .select('id', { count: 'exact', head: true });

    if (error || typeof count !== 'number') {
      console.error('[Station Se Jud Ke] Failed to fetch total connected count:', error?.message);
      return 0;
    }

    return count;
  } catch (err) {
    console.error('[Station Se Jud Ke] Unexpected error fetching total connected count:', err);
    return 0;
  }
}
