
// // PolygonDrawer.tsx
// import L from "leaflet";
// import "leaflet/dist/leaflet.css";
// import "leaflet-draw/dist/leaflet.draw.css";
// import "leaflet-draw";
// import { useEffect } from "react";
// import { useMap } from "react-leaflet";
// import { useDashboardStore } from "../../store/useDashboardStore";

// // Define types
// interface PolygonWeather {
//   id: number;
//   coordinates: [number, number][];
//   temperature: number;
//   humidity: number;
//   windSpeed: number;
// }

// // Extend leaflet draw localization
// declare module "leaflet" {
//   namespace drawLocal {
//     interface DrawToolbar {
//       actions: { title: string; text: string };
//     }
//   }
// }

// // ===== Safe initialization of L.drawLocal nested objects =====
// L.drawLocal = L.drawLocal || {};
// L.drawLocal.draw = L.drawLocal.draw || {};
// L.drawLocal.draw.toolbar = L.drawLocal.draw.toolbar || {};
// L.drawLocal.draw.toolbar.actions = L.drawLocal.draw.toolbar.actions || {};
// L.drawLocal.draw.toolbar.finish = L.drawLocal.draw.toolbar.finish || {};
// L.drawLocal.draw.toolbar.undo = L.drawLocal.draw.toolbar.undo || {};
// L.drawLocal.draw.toolbar.buttons = L.drawLocal.draw.toolbar.buttons || {};
// L.drawLocal.draw.handlers = L.drawLocal.draw.handlers || {};
// L.drawLocal.draw.handlers.polygon = L.drawLocal.draw.handlers.polygon || {};
// L.drawLocal.draw.handlers.polygon.tooltip = L.drawLocal.draw.handlers.polygon.tooltip || {};
// L.drawLocal.draw.handlers.polygon.error = L.drawLocal.draw.handlers.polygon.error || {};
// L.drawLocal.edit = L.drawLocal.edit || {};
// L.drawLocal.edit.toolbar = L.drawLocal.edit.toolbar || {};
// L.drawLocal.edit.toolbar.actions = L.drawLocal.edit.toolbar.actions || {};
// L.drawLocal.edit.toolbar.buttons = L.drawLocal.edit.toolbar.buttons || {};
// L.drawLocal.edit.handlers = L.drawLocal.edit.handlers || {};
// L.drawLocal.edit.handlers.edit = L.drawLocal.edit.handlers.edit || {};
// L.drawLocal.edit.handlers.edit.tooltip = L.drawLocal.edit.handlers.edit.tooltip || {};
// L.drawLocal.edit.handlers.remove = L.drawLocal.edit.handlers.remove || {};
// L.drawLocal.edit.handlers.remove.tooltip = L.drawLocal.edit.handlers.remove.tooltip || {};

// // Assign localization strings safely
// Object.assign(L.drawLocal.draw.toolbar.actions, {
//   title: "Cancel drawing",
//   text: "Cancel",
// });
// Object.assign(L.drawLocal.draw.toolbar.finish, {
//   title: "Finish drawing",
//   text: "Finish",
// });
// Object.assign(L.drawLocal.draw.toolbar.undo, {
//   title: "Undo last point",
//   text: "Undo",
// });
// Object.assign(L.drawLocal.draw.toolbar.buttons, {
//   polygon: "Draw a polygon",
// });
// Object.assign(L.drawLocal.draw.handlers.polygon.tooltip, {
//   start: "Click to start drawing polygon.",
//   cont: "Click to continue drawing polygon.",
//   end: "Click first point to close this polygon.",
// });
// Object.assign(L.drawLocal.draw.handlers.polygon.error, {
//   title: "Shape draw error",
//   message: "You can't draw that shape!",
// });
// Object.assign(L.drawLocal.edit.toolbar.actions.save, {
//   title: "Save changes",
//   text: "Save",
// });
// Object.assign(L.drawLocal.edit.toolbar.actions.cancel, {
//   title: "Cancel editing",
//   text: "Cancel",
// });
// Object.assign(L.drawLocal.edit.toolbar.buttons, {
//   edit: "Edit polygons",
//   remove: "Delete polygons",
// });
// Object.assign(L.drawLocal.edit.handlers.edit.tooltip, {
//   text: "Drag points to edit polygon.",
//   subtext: "Click cancel to undo changes.",
// });
// Object.assign(L.drawLocal.edit.handlers.remove.tooltip, {
//   text: "Click a polygon to remove it.",
// });

// // Utility to fetch weather
// const fetchWeatherForPolygon = async (
//   coords: [number, number][]
// ): Promise<{ temperature: number; humidity: number; windSpeed: number }> => {
//   const lat = coords.reduce((sum, c) => sum + c[0], 0) / coords.length;
//   const lng = coords.reduce((sum, c) => sum + c[1], 0) / coords.length;

//   const res = await fetch(
//     `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true&hourly=temperature_2m,humidity_2m,wind_speed_10m`
//   );
//   const data = await res.json();

//   return {
//     temperature: data.current_weather?.temperature ?? 0,
//     humidity: data.hourly?.humidity_2m ? data.hourly.humidity_2m[0] : 0,
//     windSpeed: data.current_weather?.windspeed ?? 0,
//   };
// };

// const PolygonDrawer = () => {
//   const map = useMap();
//   const addPolygon = useDashboardStore((s) => s.addPolygon);
//   const removePolygon = useDashboardStore((s) => s.removePolygon);

//   useEffect(() => {
//     if (!map) return;

//     const drawnItems = new L.FeatureGroup();
//     map.addLayer(drawnItems);

//     const drawControl = new L.Control.Draw({
//       draw: {
//         polygon: {
//           allowIntersection: false,
//           showArea: false,
//           shapeOptions: { color: "#3b82f6", weight: 2 },
//         },
//         rectangle: false,
//         circle: false,
//         marker: false,
//         polyline: false,
//         circlemarker: false,
//       },
//       edit: {
//         featureGroup: drawnItems,
//         remove: true,
//         edit: false,
//       },
//     });

//     map.addControl(drawControl);

//     map.on(L.Draw.Event.CREATED, async (e: any) => {
//       const layer = e.layer;
//       const latlngs = layer.getLatLngs()[0];
//       const coords = latlngs.map((pt: L.LatLng) => [pt.lat, pt.lng]) as [
//         number,
//         number
//       ][];
//       const id = (layer as any)._leaflet_id;

//       // Fetch weather
//       const weather = await fetchWeatherForPolygon(coords);

//       // Color based on temperature
//       let fillColor = "#3b82f6"; // default blue
//       if (weather.temperature >= 30) fillColor = "#dc2626"; // hot - red
//       else if (weather.temperature < 15) fillColor = "#2563eb"; // cold - blue
//       else fillColor = "#facc15"; // moderate - yellow

//       layer.setStyle({ fillColor, color: fillColor, fillOpacity: 0.6 });

//       // Tooltip
//       layer.bindTooltip(
//         `🌡️ Temp: ${weather.temperature}°C<br/>💧 Humidity: ${weather.humidity}%<br/>💨 Wind: ${weather.windSpeed} km/h`,
//         { permanent: true, direction: "center" }
//       );

//       drawnItems.addLayer(layer);

//       addPolygon({
//         id,
//         coordinates: coords,
//         dataSource: "open-meteo",
//         rules: [],
//         values: [
//           weather.temperature,
//           weather.humidity,
//           weather.windSpeed,
//         ],
//       });
//     });

//     map.on(L.Draw.Event.DELETED, (e: any) => {
//       e.layers.eachLayer((layer: any) => {
//         const id = layer._leaflet_id;
//         removePolygon(id);
//       });
//     });

//     // Export button
//     const exportBtn = L.DomUtil.create("button", "export-geojson-btn");
//     exportBtn.innerText = "⬇ Export GeoJSON";
//     exportBtn.style.position = "absolute";
//     exportBtn.style.top = "10px";
//     exportBtn.style.right = "10px";
//     exportBtn.style.zIndex = "1000";
//     exportBtn.style.padding = "6px 12px";
//     exportBtn.style.background = "#3b82f6";
//     exportBtn.style.color = "#fff";
//     exportBtn.style.border = "none";
//     exportBtn.style.borderRadius = "4px";
//     exportBtn.style.cursor = "pointer";

//     exportBtn.onclick = () => {
//       const geojson = drawnItems.toGeoJSON();
//       const blob = new Blob([JSON.stringify(geojson)], {
//         type: "application/json",
//       });
//       const link = document.createElement("a");
//       link.href = URL.createObjectURL(blob);
//       link.download = "polygons.geojson";
//       link.click();
//     };

//     map.getContainer().appendChild(exportBtn);

//     return () => {
//       map.removeControl(drawControl);
//       map.removeLayer(drawnItems);
//       exportBtn.remove();
//     };
//   }, [map, addPolygon, removePolygon]);

//   return null;
// };

// export default PolygonDrawer;


// PolygonDrawer.tsx
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet-draw";
import { useEffect } from "react";
import { useMap } from "react-leaflet";
import { useDashboardStore } from "../../store/useDashboardStore";

interface PolygonWeather {
  id: number;
  coordinates: [number, number][];
  temperature: number;
  humidity: number;
  windSpeed: number;
}

declare module "leaflet" {
  namespace drawLocal {
    interface DrawToolbar {
      actions: { title: string; text: string };
    }
  }
}

// Initialize localization objects safely
L.drawLocal = L.drawLocal || {};
L.drawLocal.draw = L.drawLocal.draw || {};
L.drawLocal.draw.toolbar = L.drawLocal.draw.toolbar || {};
L.drawLocal.draw.toolbar.actions = L.drawLocal.draw.toolbar.actions || {};
L.drawLocal.draw.toolbar.finish = L.drawLocal.draw.toolbar.finish || {};
L.drawLocal.draw.toolbar.undo = L.drawLocal.draw.toolbar.undo || {};
L.drawLocal.draw.toolbar.buttons = L.drawLocal.draw.toolbar.buttons || {};
L.drawLocal.draw.handlers = L.drawLocal.draw.handlers || {};
L.drawLocal.draw.handlers.polygon = L.drawLocal.draw.handlers.polygon || {};
L.drawLocal.draw.handlers.polygon.tooltip = L.drawLocal.draw.handlers.polygon.tooltip || {};
L.drawLocal.draw.handlers.polygon.error = L.drawLocal.draw.handlers.polygon.error || {};
L.drawLocal.edit = L.drawLocal.edit || {};
L.drawLocal.edit.toolbar = L.drawLocal.edit.toolbar || {};
L.drawLocal.edit.toolbar.actions = L.drawLocal.edit.toolbar.actions || {};
L.drawLocal.edit.toolbar.buttons = L.drawLocal.edit.toolbar.buttons || {};
L.drawLocal.edit.handlers = L.drawLocal.edit.handlers || {};
L.drawLocal.edit.handlers.edit = L.drawLocal.edit.handlers.edit || {};
L.drawLocal.edit.handlers.edit.tooltip = L.drawLocal.edit.handlers.edit.tooltip || {};
L.drawLocal.edit.handlers.remove = L.drawLocal.edit.handlers.remove || {};
L.drawLocal.edit.handlers.remove.tooltip = L.drawLocal.edit.handlers.remove.tooltip || {};

// Assign localization strings
Object.assign(L.drawLocal.draw.toolbar.actions, {
  title: "Cancel drawing",
  text: "Cancel",
});
Object.assign(L.drawLocal.draw.toolbar.finish, {
  title: "Finish drawing",
  text: "Finish",
});
Object.assign(L.drawLocal.draw.toolbar.undo, {
  title: "Undo last point",
  text: "Undo",
});
Object.assign(L.drawLocal.draw.toolbar.buttons, {
  polygon: "Draw a polygon",
});
Object.assign(L.drawLocal.draw.handlers.polygon.tooltip, {
  start: "Click to start drawing polygon.",
  cont: "Click to continue drawing polygon.",
  end: "Click first point to close this polygon.",
});
Object.assign(L.drawLocal.draw.handlers.polygon.error, {
  title: "Shape draw error",
  message: "You can't draw that shape!",
});
Object.assign(L.drawLocal.edit.toolbar.actions.save, {
  title: "Save changes",
  text: "Save",
});
Object.assign(L.drawLocal.edit.toolbar.actions.cancel, {
  title: "Cancel editing",
  text: "Cancel",
});
Object.assign(L.drawLocal.edit.toolbar.buttons, {
  edit: "Edit polygons",
  remove: "Delete polygons",
});
Object.assign(L.drawLocal.edit.handlers.edit.tooltip, {
  text: "Drag points to edit polygon.",
  subtext: "Click cancel to undo changes.",
});
Object.assign(L.drawLocal.edit.handlers.remove.tooltip, {
  text: "Click a polygon to remove it.",
});

const fetchWeatherForPolygon = async (
  coords: [number, number][]
): Promise<{ temperature: number; humidity: number; windSpeed: number }> => {
  try {
    const lat = coords.reduce((sum, c) => sum + c[0], 0) / coords.length;
    const lng = coords.reduce((sum, c) => sum + c[1], 0) / coords.length;

    // Validate coordinates
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

    return {
      temperature: data.current_weather?.temperature ?? 0,
      humidity: data.hourly?.relative_humidity_2m?.[0] ?? 0,
      windSpeed: data.current_weather?.windspeed ?? 0,
    };
  } catch (error) {
    console.error("Failed to fetch weather data:", error);
    return {
      temperature: 0,
      humidity: 0,
      windSpeed: 0,
    };
  }
};

const PolygonDrawer = () => {
  const map = useMap();
  const addPolygon = useDashboardStore((s) => s.addPolygon);
  const removePolygon = useDashboardStore((s) => s.removePolygon);

  useEffect(() => {
    if (!map) return;

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

    const handleCreate = async (e: L.DrawEvents.Created) => {
      try {
        const layer = e.layer;
        const latlngs = (layer as L.Polygon).getLatLngs()[0];
        const coords = latlngs.map((pt: L.LatLng) => [pt.lat, pt.lng]) as [
          number,
          number
        ][];
        const id = (layer as any)._leaflet_id;

        const weather = await fetchWeatherForPolygon(coords);

        let fillColor = "#3b82f6"; // default blue
        if (weather.temperature >= 30) fillColor = "#dc2626"; // hot - red
        else if (weather.temperature < 15) fillColor = "#2563eb"; // cold - blue
        else fillColor = "#facc15"; // moderate - yellow

        layer.setStyle({ fillColor, color: fillColor, fillOpacity: 0.6 });

        layer.bindTooltip(
          `🌡️ Temp: ${weather.temperature}°C<br/>💧 Humidity: ${weather.humidity}%<br/>💨 Wind: ${weather.windSpeed} km/h`,
          { permanent: true, direction: "center" }
        );

        drawnItems.addLayer(layer);

        addPolygon({
          id,
          coordinates: coords,
          dataSource: "open-meteo",
          rules: [],
          values: [weather.temperature, weather.humidity, weather.windSpeed],
        });
      } catch (error) {
        console.error("Error creating polygon:", error);
      }
    };

    const handleDelete = (e: L.DrawEvents.Deleted) => {
      try {
        e.layers.eachLayer((layer: any) => {
          const id = layer._leaflet_id;
          removePolygon(id);
        });
      } catch (error) {
        console.error("Error deleting polygon:", error);
      }
    };

    map.on(L.Draw.Event.CREATED, handleCreate);
    map.on(L.Draw.Event.DELETED, handleDelete);

    // Export button
    const exportBtn = L.DomUtil.create("button", "export-geojson-btn");
    exportBtn.innerText = "⬇ Export GeoJSON";
    exportBtn.style.position = "absolute";
    exportBtn.style.top = "10px";
    exportBtn.style.right = "10px";
    exportBtn.style.zIndex = "1000";
    exportBtn.style.padding = "6px 12px";
    exportBtn.style.background = "#3b82f6";
    exportBtn.style.color = "#fff";
    exportBtn.style.border = "none";
    exportBtn.style.borderRadius = "4px";
    exportBtn.style.cursor = "pointer";

    exportBtn.onclick = () => {
      try {
        const geojson = drawnItems.toGeoJSON();
        const blob = new Blob([JSON.stringify(geojson)], {
          type: "application/json",
        });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "polygons.geojson";
        link.click();
      } catch (error) {
        console.error("Error exporting GeoJSON:", error);
      }
    };

    map.getContainer().appendChild(exportBtn);

    return () => {
      map.off(L.Draw.Event.CREATED, handleCreate);
      map.off(L.Draw.Event.DELETED, handleDelete);
      map.removeControl(drawControl);
      map.removeLayer(drawnItems);
      exportBtn.remove();
    };
  }, [map, addPolygon, removePolygon]);

  return null;
};

export default PolygonDrawer;