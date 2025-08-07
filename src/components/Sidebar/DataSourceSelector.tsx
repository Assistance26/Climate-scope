
export default function DataSourceSelector() {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-300">Select Data Source</label>
      <select
        className="w-full p-3 rounded-xl border border-gray-500 bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all hover:scale-[1.01]"
      >
        <option className="bg-gray-900 text-white">Open Meteo</option>
        <option className="bg-gray-900 text-white">Custom Source</option>
      </select>
      <p className="text-xs text-gray-400">Choose the source from which to fetch weather data.</p>
    </div>
  );
}
