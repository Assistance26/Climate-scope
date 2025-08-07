import React from "react";

export default function Legend() {
  return (
    <div className="flex space-x-4 items-center">
      <div className="w-6 h-6 bg-green-500 rounded"></div>
      <span className="text-sm text-gray-700">Safe</span>
      <div className="w-6 h-6 bg-yellow-400 rounded"></div>
      <span className="text-sm text-gray-700">Warning</span>
      <div className="w-6 h-6 bg-red-500 rounded"></div>
      <span className="text-sm text-gray-700">Danger</span>
    </div>
  );
}
