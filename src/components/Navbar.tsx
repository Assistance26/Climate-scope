import React from "react";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between p-6 bg-black/70 backdrop-blur-md shadow-xl sticky top-0 z-50">
      <h1 className="text-2xl font-extrabold text-white tracking-wide animate-pulse">🌍 HackGlobe</h1>
      <div className="space-x-4">
        <button className="text-gray-300 hover:text-white transition-all duration-300 hover:scale-110">
          Home
        </button>
        <button className="text-gray-300 hover:text-white transition-all duration-300 hover:scale-110">
          About
        </button>
      </div>
    </nav>
  );
}