
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";

function App() {
  return (
    <div className="bg-gradient-to-tr from-gray-900 via-black to-gray-800 min-h-screen text-gray-100 font-sans">
      <Navbar />
      <HomePage />
    </div>
  );
}

export default App;