
// //src/components/Map/Map.tsx
// import { useEffect } from "react";
// import { MapContainer, TileLayer } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
// import PolygonDrawer from "./PolygonDrawer";
// import Loader from "../UI/Loader";

// export default function Map() {
//   useEffect(() => {
//     const container = document.getElementById("leaflet-map");
//     if (container && (container as any)._leaflet_id != null) {
//       (container as any)._leaflet_id = null; // Clear stale Leaflet instance if it exists
//     }
//   }, []);

//   return (
//     <div className="relative h-full w-full rounded-2xl bg-gradient-to-br from-blue-950 to-blue-900 p-6 text-white shadow-2xl animate-fade-in">
//       <h2 className="text-lg font-semibold mb-4">🗺️ Interactive Map</h2>

//       <div className="h-96 w-full border-2 border-blue-700 rounded-xl overflow-hidden">
//         <MapContainer
//           id="leaflet-map" // 👈 Added ID to target DOM node
//           center={[20.5937, 78.9629]} // Center of India
//           zoom={13}
//           scrollWheelZoom={false}
//           dragging={true}
//           doubleClickZoom={false}
//           zoomControl={false}
//           style={{ height: "100%", width: "100%" }}
//         >
//           <TileLayer
//             attribution="© OpenStreetMap"
//             url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//           />
//           <PolygonDrawer />
//         </MapContainer>
//       </div>

//       {/* Keep the Loader visible */}
//       <Loader />
//     </div>
//   );
// }


// src/components/Map/Map.tsx

import { useEffect } from "react";
import { MapContainer, TileLayer, Polygon } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import PolygonDrawer from "./PolygonDrawer";
import Loader from "../UI/Loader";
import { useDashboardStore } from "../../store/useDashboardStore";

export default function Map() {
  const polygons = useDashboardStore((state) => state.polygons);

  useEffect(() => {
    const container = document.getElementById("leaflet-map");
    if (container && (container as any)._leaflet_id != null) {
      (container as any)._leaflet_id = null;
    }
  }, []);

  return (
    <div className="relative h-full w-full rounded-2xl bg-gradient-to-br from-blue-950 to-blue-900 p-6 text-white shadow-2xl animate-fade-in">
      <h2 className="text-lg font-semibold mb-4">🗺️ Interactive Map</h2>

      <div className="h-96 w-full border-2 border-blue-700 rounded-xl overflow-hidden">
        <MapContainer
          id="leaflet-map"
          center={[20.5937, 78.9629]} // Center of India
          zoom={5}
          scrollWheelZoom={false}
          dragging={true}
          doubleClickZoom={false}
          zoomControl={false}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution="© OpenStreetMap"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* 🔵 Render all polygons from Zustand store */}
          {polygons.map((polygon) => (
            <Polygon
              key={polygon.id}
              positions={polygon.coordinates}
              pathOptions={{ color: polygon.color || "#3b82f6", weight: 2 }}
            />
          ))}

          {/* ✏️ Enable polygon drawing/editing */}
          <PolygonDrawer />
        </MapContainer>
      </div>

      {/* ⏳ Optional loader */}
      <Loader />
    </div>
  );
}
