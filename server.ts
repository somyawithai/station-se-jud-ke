import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { CITIES_METRO_DATA, NATIONAL_METRO_HUBS } from './src/data/metroData.ts';
import { UserStationSelection, NationalAnalytics } from './src/types.ts';

const app = express();
const PORT = 3000;
const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'metro_store.json');

app.use(express.json());

interface AppDatabase {
  selections: UserStationSelection[];
  analytics: {
    totalVisitors: number;
    returningUsers: Set<string> | string[];
    citiesExplored: Record<string, number>;
    sessionsCount: number;
  };
}

// Initial state with curated seed stats representing active nationwide metro pride
const initialData: {
  selections: UserStationSelection[];
  analytics: {
    totalVisitors: number;
    returningUsers: string[];
    citiesExplored: Record<string, number>;
    sessionsCount: number;
  };
} = {
  selections: [
    {
      userId: 'seed-user-1',
      userName: 'Aarav Sharma',
      cityId: 'delhi',
      cityName: 'Delhi NCR',
      stationId: 'del-yel-rajiv-chowk',
      stationName: 'Rajiv Chowk (CP)',
      stationHindiName: 'राजीव चौक (कनॉट प्लेस)',
      lineIds: ['delhi-yellow', 'delhi-blue'],
      lineColors: ['#EAB308', '#2563EB'],
      confirmedAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
    },
    {
      userId: 'seed-user-2',
      userName: 'Priya Reddy',
      cityId: 'hyderabad',
      cityName: 'Hyderabad',
      stationId: 'hyd-red-ameerpet',
      stationName: 'Ameerpet',
      stationHindiName: 'अमीरपेट',
      lineIds: ['hyd-red', 'hyd-blue'],
      lineColors: ['#DC2626', '#2563EB'],
      confirmedAt: new Date(Date.now() - 3600000 * 18).toISOString(),
    },
    {
      userId: 'seed-user-3',
      userName: 'Vikas Shukla',
      cityId: 'kanpur',
      cityName: 'Kanpur',
      stationId: 'kan-org-iitk',
      stationName: 'IIT Kanpur',
      stationHindiName: 'आईआईटी कानपुर',
      lineIds: ['kan-orange'],
      lineColors: ['#EA580C'],
      confirmedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    },
    {
      userId: 'seed-user-4',
      userName: 'Ananya Verma',
      cityId: 'delhi',
      cityName: 'Delhi NCR',
      stationId: 'del-yel-hauz-khas',
      stationName: 'Hauz Khas',
      stationHindiName: 'हौज़ खास',
      lineIds: ['delhi-yellow', 'delhi-magenta'],
      lineColors: ['#EAB308', '#C026D3'],
      confirmedAt: new Date(Date.now() - 3600000 * 6).toISOString(),
    },
    {
      userId: 'seed-user-5',
      userName: 'Rohit Kulkarni',
      cityId: 'hyderabad',
      cityName: 'Hyderabad',
      stationId: 'hyd-blu-hitec-city',
      stationName: 'HITEC City',
      stationHindiName: 'हाइटेक सिटी',
      lineIds: ['hyd-blue'],
      lineColors: ['#2563EB'],
      confirmedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    },
    {
      userId: 'seed-user-6',
      userName: 'Neha Gupta',
      cityId: 'kanpur',
      cityName: 'Kanpur',
      stationId: 'kan-org-motijheel',
      stationName: 'Moti Jheel',
      stationHindiName: 'मोती झील',
      lineIds: ['kan-orange'],
      lineColors: ['#EA580C'],
      confirmedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    },
  ],
  analytics: {
    totalVisitors: 1248,
    returningUsers: ['seed-user-1', 'seed-user-2', 'seed-user-3'],
    citiesExplored: {
      delhi: 840,
      hyderabad: 610,
      kanpur: 395,
      mumbai: 210,
      bengaluru: 180,
      kolkata: 145,
    },
    sessionsCount: 1680,
  },
};

// In-memory cache + file sync
let dbData = { ...initialData };

function loadDb() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      dbData = {
        selections: parsed.selections || initialData.selections,
        analytics: {
          totalVisitors: parsed.analytics?.totalVisitors || initialData.analytics.totalVisitors,
          returningUsers: Array.isArray(parsed.analytics?.returningUsers)
            ? parsed.analytics.returningUsers
            : initialData.analytics.returningUsers,
          citiesExplored: parsed.analytics?.citiesExplored || initialData.analytics.citiesExplored,
          sessionsCount: parsed.analytics?.sessionsCount || initialData.analytics.sessionsCount,
        },
      };
    } else {
      saveDb();
    }
  } catch (err) {
    console.error('Error loading database file:', err);
  }
}

function saveDb() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(dbData, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving database file:', err);
  }
}

loadDb();

// -------------------------------------------------------------
// API ROUTES
// -------------------------------------------------------------

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Get all cities metro networks
app.get('/api/metro-cities', (req, res) => {
  const citiesOverview = CITIES_METRO_DATA.map((c) => ({
    id: c.id,
    name: c.name,
    hindiName: c.hindiName,
    state: c.state,
    tagline: c.tagline,
    totalStationsCount: c.stations.length,
    totalLinesCount: c.lines.length,
    networkLengthKm: c.networkLengthKm,
    established: c.established,
    centerCoordinates: c.centerCoordinates,
    indiaMapPosition: c.indiaMapPosition,
    lines: c.lines.map((l) => ({
      id: l.id,
      name: l.name,
      hindiName: l.hindiName,
      color: l.color,
      code: l.code,
      stationCount: l.stationIds.length,
    })),
  }));
  res.json({ cities: citiesOverview, nationalHubs: NATIONAL_METRO_HUBS });
});

// Get full city network detail
app.get('/api/metro-city/:cityId', (req, res) => {
  const city = CITIES_METRO_DATA.find((c) => c.id === req.params.cityId);
  if (!city) {
    return res.status(404).json({ error: 'City not found' });
  }
  res.json(city);
});

// Get user's confirmed selections
app.get('/api/user-selections/:userId', (req, res) => {
  const { userId } = req.params;
  const userSelections = dbData.selections.filter((s) => s.userId === userId);
  res.json({ selections: userSelections });
});

// Confirm station selection: ENFORCE ONE STATION PER CITY
app.post('/api/confirm-station', (req, res) => {
  const { userId, userName, cityId, stationId } = req.body;

  if (!userId || !cityId || !stationId) {
    return res.status(400).json({ error: 'Missing required parameters: userId, cityId, stationId' });
  }

  const city = CITIES_METRO_DATA.find((c) => c.id === cityId);
  if (!city) {
    return res.status(404).json({ error: 'Invalid city' });
  }

  const station = city.stations.find((s) => s.id === stationId);
  if (!station) {
    return res.status(404).json({ error: 'Invalid station for this city' });
  }

  const lineColors = station.lineIds
    .map((lineId) => {
      const line = city.lines.find((l) => l.id === lineId);
      return line ? line.color : '#EA580C';
    })
    .filter(Boolean);

  const newSelection: UserStationSelection = {
    userId,
    userName: userName && userName.trim() ? userName.trim() : undefined,
    cityId,
    cityName: city.name,
    stationId,
    stationName: station.name,
    stationHindiName: station.hindiName,
    lineIds: station.lineIds,
    lineColors,
    confirmedAt: new Date().toISOString(),
  };

  // Enforce one station per city per user:
  // Find if user already had a station in this city
  const existingIdx = dbData.selections.findIndex(
    (s) => s.userId === userId && s.cityId === cityId
  );

  let wasUpdated = false;
  if (existingIdx >= 0) {
    dbData.selections[existingIdx] = newSelection;
    wasUpdated = true;
  } else {
    dbData.selections.push(newSelection);
  }

  saveDb();

  res.json({
    success: true,
    selection: newSelection,
    isUpdate: wasUpdated,
    message: wasUpdated
      ? `Updated your nearest station in ${city.name} to ${station.name}`
      : `Successfully connected with ${station.name} (${city.name})`,
  });
});

// Remove station selection for a specific city
app.delete('/api/remove-selection', (req, res) => {
  const { userId, cityId } = req.body;
  if (!userId || !cityId) {
    return res.status(400).json({ error: 'Missing userId or cityId' });
  }

  const initialLen = dbData.selections.length;
  dbData.selections = dbData.selections.filter(
    (s) => !(s.userId === userId && s.cityId === cityId)
  );

  if (dbData.selections.length < initialLen) {
    saveDb();
    res.json({ success: true, message: 'Selection removed' });
  } else {
    res.json({ success: true, message: 'No selection found to remove' });
  }
});

// Get National Analytics
app.get('/api/analytics', (req, res) => {
  const stationCounts: Record<string, { count: number; name: string; cityName: string; stationId: string }> = {};
  const cityCounts: Record<string, number> = {};

  dbData.selections.forEach((sel) => {
    // City count
    cityCounts[sel.cityId] = (cityCounts[sel.cityId] || 0) + 1;

    // Station count
    if (!stationCounts[sel.stationId]) {
      stationCounts[sel.stationId] = {
        stationId: sel.stationId,
        count: 0,
        name: sel.stationName,
        cityName: sel.cityName,
      };
    }
    stationCounts[sel.stationId].count += 1;
  });

  const sortedStations = Object.values(stationCounts)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
    .map((s) => ({
      stationId: s.stationId,
      stationName: s.name,
      cityName: s.cityName,
      count: s.count,
    }));

  const activeCitiesCount = Object.keys(cityCounts).length;
  const totalCitiesExploredCount = Object.values(dbData.analytics.citiesExplored).reduce((a, b) => a + b, 0);

  const analyticsResponse: NationalAnalytics = {
    totalVisitors: dbData.analytics.totalVisitors,
    totalConfirmations: dbData.selections.length,
    activeCitiesCount,
    citiesExploredTotal: totalCitiesExploredCount,
    returningUsersCount: dbData.analytics.returningUsers.length,
    mostSelectedStations: sortedStations,
    cityConfirmations: cityCounts,
  };

  res.json(analyticsResponse);
});

// Track session & city exploration
app.post('/api/track-session', (req, res) => {
  const { userId, cityExplored, isReturning } = req.body;

  if (userId) {
    if (isReturning) {
      if (!dbData.analytics.returningUsers.includes(userId)) {
        dbData.analytics.returningUsers.push(userId);
      }
    } else {
      dbData.analytics.totalVisitors += 1;
    }
  }

  if (cityExplored) {
    dbData.analytics.citiesExplored[cityExplored] =
      (dbData.analytics.citiesExplored[cityExplored] || 0) + 1;
  }

  dbData.analytics.sessionsCount += 1;
  saveDb();

  res.json({ success: true });
});

// -------------------------------------------------------------
// VITE & SERVER STARTUP
// -------------------------------------------------------------

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Station Se Jud Ke Server listening at http://localhost:${PORT}`);
  });
}

startServer();
