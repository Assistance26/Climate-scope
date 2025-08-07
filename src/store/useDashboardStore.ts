import { create } from 'zustand';
import { fetchMeteoData } from '../utils/fetchMeteoData';
import { calculateCentroid } from '../utils/polygonUtils';
import { getColorForValue } from '../utils/colorLogic';

interface Rule {
  operator: '=' | '<' | '>' | '<=' | '>='; 
  value: number;
  color: string;
}

interface Polygon {
  id: number;
  coordinates: [number, number][];
  dataSource: string;
  rules: Rule[];
  values: number[]; // fetched hourly values in timeline range
  color?: string;   // polygon's current color based on rules & values
}

interface TimelineRange {
  start: number; // e.g., hour offset or Unix timestamp
  end: number;
}

interface DashboardState {
  polygons: Polygon[];
  timeline: TimelineRange;

  addPolygon: (poly: Polygon) => void;
  removePolygon: (id: number) => void;
  setTimeline: (range: TimelineRange) => void;

  updatePolygonValues: (id: number, values: number[]) => void;

  fetchWeatherForPolygons: () => Promise<void>;
  updatePolygonColors: () => void;
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
  polygons: [],
  timeline: { start: 0, end: 0 },

  addPolygon: (poly) => set((state) => ({
    polygons: [...state.polygons, poly],
  })),

  removePolygon: (id) => set((state) => ({
    polygons: state.polygons.filter((p) => p.id !== id),
  })),

  setTimeline: (range) => {
    set({ timeline: range });
    // Fetch data and update colors on timeline change
    get().fetchWeatherForPolygons().then(() => get().updatePolygonColors());
  },

  updatePolygonValues: (id, values) => set((state) => ({
    polygons: state.polygons.map((p) =>
      p.id === id ? { ...p, values } : p
    ),
  })),

  fetchWeatherForPolygons: async () => {
    const { polygons, timeline } = get();

    for (const polygon of polygons) {
      try {
        const centroid = calculateCentroid(polygon.coordinates);

        // Convert timeline start/end (hour offsets) to ISO dates (YYYY-MM-DD)
        const startDate = new Date(timeline.start * 3600 * 1000).toISOString().slice(0, 10);
        const endDate = new Date(timeline.end * 3600 * 1000).toISOString().slice(0, 10);

        const data = await fetchMeteoData({
          latitude: centroid[0],
          longitude: centroid[1],
          startDate,
          endDate,
          hourlyFields: ['temperature_2m'], // can expand this later
        });

        const values = data.hourly.temperature_2m || [];

        get().updatePolygonValues(polygon.id, values);
      } catch (error) {
        console.error('Error fetching weather for polygon', polygon.id, error);
      }
    }
  },

  updatePolygonColors: () => {
    const { polygons } = get();

    const coloredPolygons = polygons.map((polygon) => {
      if (!polygon.values || polygon.values.length === 0) return polygon;

      // Calculate average of hourly values over the timeline range
      const avgValue = polygon.values.reduce((sum, val) => sum + val, 0) / polygon.values.length;

      // Use your reusable color logic function with polygon rules
      const color = getColorForValue(avgValue, polygon.rules);

      return {
        ...polygon,
        color,
      };
    });

    set({ polygons: coloredPolygons });
  },
}));