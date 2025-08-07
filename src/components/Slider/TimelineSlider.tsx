import  { useEffect, useState } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import dayjs from "dayjs";
import { useDashboardStore } from "../../store/useDashboardStore";

const HOURS_RANGE = 24 * 30;
const now = dayjs();

const TimelineSlider = () => {
  const timeline = useDashboardStore((s) => s.timeline);
  const setTimeline = useDashboardStore((s) => s.setTimeline);

  // Initialize local state from store timeline or default range (-15 days to now)
  const [range, setRange] = useState<[number, number]>(
    timeline.start !== 0 && timeline.end !== 0
      ? [timeline.start, timeline.end]
      : [-24 * 15, 0]
  );

  // Keep local range in sync when store timeline changes externally
  useEffect(() => {
    setRange([timeline.start, timeline.end]);
  }, [timeline]);

  const getLabel = (offset: number) =>
    now.add(offset, "hour").format("MMM D, HH:mm");

  const onChange = (val: number | number[]) => {
    if (Array.isArray(val)) {
      setRange(val as [number, number]);
      // Update Zustand store timeline with new range
      setTimeline({ start: val[0], end: val[1] });
    }
  };

  return (
    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-[90%] md:w-[70%] bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-2xl border border-white/10 z-50">
      <Slider
        range
        min={-HOURS_RANGE / 2}
        max={HOURS_RANGE / 2}
        value={range}
        onChange={onChange}
        step={1}
        allowCross={false}
        trackStyle={[{ backgroundColor: "#3b82f6" }]}
        handleStyle={[
          { borderColor: "#3b82f6", backgroundColor: "#3b82f6" },
          { borderColor: "#3b82f6", backgroundColor: "#3b82f6" },
        ]}
        railStyle={{ backgroundColor: "#1f2937" }}
        aria-label="Timeline range slider"
      />
      <div className="flex justify-between text-xs md:text-sm text-gray-300 mt-3 px-1 select-none">
        <span>{getLabel(range[0])}</span>
        <span>{getLabel(range[1])}</span>
      </div>
      <div className="text-center mt-2 text-gray-300 text-sm animate-fade-in select-none">
        Drag to view hourly weather data ⏱️
      </div>
    </div>
  );
};

export default TimelineSlider;
