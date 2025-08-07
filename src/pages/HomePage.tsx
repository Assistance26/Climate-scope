
import Map from "../components/Map/Map";
import Sidebar from "../components/Sidebar/Sidebar";
import TimelineSlider from "../components/Slider/TimelineSlider";

export default function HomePage() {
  return (
    <div className="flex h-[calc(100vh-64px)]">
      <Sidebar />
      <main className="flex-1 relative overflow-hidden">
        {/* Map fills container */}
        <Map />

        {/* Timeline slider fixed at bottom center */}
        <TimelineSlider />
      </main>
    </div>
  );
}
