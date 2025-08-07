
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet-draw";
import { useEffect } from "react";
import { useMap } from "react-leaflet";
import { useDashboardStore } from "../../store/useDashboardStore";

// Extended Leaflet type definitions
declare module "leaflet" {
  namespace drawLocal {
    interface DrawHandlersPolygon {
      tooltip: { start: string; cont: string; end: string };
      error: { title: string; message: string };
    }
  }
}

interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
}

// Initialize Leaflet draw localization
const initializeDrawLocalization = () => {
  L.drawLocal.draw = L.drawLocal.draw || {};
  L.drawLocal.draw.handlers = L.drawLocal.draw.handlers || {};
  L.drawLocal.draw.handlers.polygon = L.drawLocal.draw.handlers.polygon || {};
  
  Object.assign(L.drawLocal.draw.handlers.polygon, {
    tooltip: {
      start: "Click to start drawing polygon.",
      cont: "Click to continue drawing polygon.",
      end: "Click first point to close this polygon.",
    },
    error: {
      title: "Shape draw error",
      message: "You can't draw that shape!",
    },
  });

  Object.assign(L.drawLocal.draw.toolbar?.actions || {}, {
    title: "Cancel drawing",
    text: "Cancel",
  });
};

const fetchWeatherForPolygon = async (
  coords: [number, number][]
): Promise<WeatherData> => {
  try {
    const lat = coords.reduce((sum, c) => sum + c[0], 0) / coords.length;
    const lng = coords.reduce((sum, c) => sum + c[1], 0) / coords.length;

    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      throw new Error("Invalid coordinates");
    }

    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true&hourly=relative_humidity_2m,wind_speed_10m`
    );

    if (!res.ok) {
      throw new Error(`API request failed with status ${res.status}`);
    }

    const data = await res.json();

    if (!data.current_weather) {
      throw new Error("Invalid weather data response");
    }

    return {
      temperature: data.current_weather.temperature,
      humidity: data.hourly?.relative_humidity_2m?.[0] ?? 0,
      windSpeed: data.current_weather.windspeed,
    };
  } catch (error) {
    console.error("Failed to fetch weather data:", error);
    throw error;
  }
};

const getColorForTemperature = (temp: number): string => {
  if (temp >= 30) return "#dc2626";
  if (temp < 15) return "#2563eb";
  return "#facc15";
};

const PolygonDrawer = () => {
  const map = useMap();
  const addPolygon = useDashboardStore((s) => s.addPolygon);
  const removePolygon = useDashboardStore((s) => s.removePolygon);

  useEffect(() => {
    if (!map) return;

    initializeDrawLocalization();
    const drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);

    const drawControl = new L.Control.Draw({
      draw: {
        polygon: {
          allowIntersection: false,
          showArea: false,
          shapeOptions: { color: "#3b82f6", weight: 2 },
        },
        rectangle: false,
        circle: false,
        marker: false,
        polyline: false,
        circlemarker: false,
      },
      edit: {
        featureGroup: drawnItems,
        remove: true,
        edit: false,
      },
    });

    map.addControl(drawControl);

    const handleCreate = async (e: L.LeafletEvent) => {
      try {
        const createdEvent = e as unknown as L.DrawEvents.Created;
        const layer = createdEvent.layer as L.Polygon;
        const latlngs = layer.getLatLngs();
        
        let coords: [number, number][];
        if (Array.isArray(latlngs[0])) {
          coords = (latlngs[0] as L.LatLng[]).map((pt) => [pt.lat, pt.lng]);
        } else {
          coords = (latlngs as L.LatLng[]).map((pt) => [pt.lat, pt.lng]);
        }

        const weather = await fetchWeatherForPolygon(coords);
        const fillColor = getColorForTemperature(weather.temperature);

        layer.setStyle({
          fillColor,
          color: fillColor,
          fillOpacity: 0.6,
        });

        layer.bindTooltip(
          `🌡️ Temp: ${weather.temperature.toFixed(1)}°C<br/>` +
          `💧 Humidity: ${weather.humidity.toFixed(1)}%<br/>` +
          `💨 Wind: ${weather.windSpeed.toFixed(1)} km/h`,
          { permanent: true, direction: "center" }
        );

        drawnItems.addLayer(layer);

        addPolygon({
          id: L.stamp(layer),
          coordinates: coords,
          dataSource: "open-meteo",
          rules: [],
          values: [weather.temperature, weather.humidity, weather.windSpeed],
        });

      } catch (error) {
        console.error("Error creating polygon:", error);
        map.openPopup("Failed to create polygon. Please try again.", map.getCenter());
      }
    };

    const handleDelete = (e: L.LeafletEvent) => {
      try {
        const deletedEvent = e as unknown as L.DrawEvents.Deleted;
        deletedEvent.layers.eachLayer((layer: L.Layer) => {
          removePolygon(L.stamp(layer));
        });
      } catch (error) {
        console.error("Error deleting polygon:", error);
        map.openPopup("Failed to delete polygon.", map.getCenter());
      }
    };

    // Use Leaflet's string event types instead of typed events
    map.on('draw:created', handleCreate as L.LeafletEventHandlerFn);
    map.on('draw:deleted', handleDelete as L.LeafletEventHandlerFn);

    // Export button
    const exportBtn = L.DomUtil.create("button", "export-geojson-btn");
    exportBtn.innerHTML = "⬇ Export GeoJSON";
    Object.assign(exportBtn.style, {
      position: "absolute",
      top: "10px",
      right: "10px",
      zIndex: "1000",
      padding: "6px 12px",
      background: "#3b82f6",
      color: "#fff",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
    });

    exportBtn.onclick = () => {
      try {
        const geojson = drawnItems.toGeoJSON();
        const blob = new Blob([JSON.stringify(geojson, null, 2)], {
          type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `polygons-${new Date().toISOString()}.geojson`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Error exporting GeoJSON:", error);
        map.openPopup("Failed to export data.", map.getCenter());
      }
    };

    map.getContainer().appendChild(exportBtn);

    return () => {
      map.off('draw:created', handleCreate as L.LeafletEventHandlerFn);
      map.off('draw:deleted', handleDelete as L.LeafletEventHandlerFn);
      map.removeControl(drawControl);
      map.removeLayer(drawnItems);
      exportBtn.remove();
    };
  }, [map, addPolygon, removePolygon]);

  return null;
};

export default PolygonDrawer;