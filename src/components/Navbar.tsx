
export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 p-4 bg-black/70 backdrop-blur-md shadow-xl">
      <div className="flex items-center justify-center">
        <h1 className="text-2xl font-extrabold text-white tracking-wide">
          <span className="inline-block animate-pulse">🌍</span> Climate-Scope
        </h1>
      </div>
    </header>
  );
}