import React from "react";

export default function RuleEditor() {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-300">Color Threshold</label>
      <input
        type="text"
        placeholder="e.g., > 30°C = Red"
        className="w-full p-3 rounded-xl border border-gray-500 bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
      />
      <button className="w-full mt-2 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-transform hover:scale-105">
        Save Rule
      </button>
    </div>
  );
}