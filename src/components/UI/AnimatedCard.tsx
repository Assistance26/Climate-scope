import React from "react";

export default function AnimatedCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-6 bg-gradient-to-br from-white/10 to-white/5 rounded-2xl shadow-xl backdrop-blur-md transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl">
      {children}
    </div>
  );
}