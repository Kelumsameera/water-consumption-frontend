import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="w-full px-8 py-6 bg-header-bg shadow-md flex items-center justify-between">
      
      {/* LEFT: TITLE (always visible) */}
      <div className="flex flex-row items-center gap-2 text-sm lg:text-2xl font-bold text-white">
        <img src="/logo.svg" alt="logo" className="w-8 h-8 inline-block" />
        <h1> Water Tank Monitor</h1>
      </div>

      {/* RIGHT: NAVIGATION (LG ONLY) */}
      <nav className="hidden lg:flex items-center gap-4">
        <Link
          to="/"
          className="p-1 px-3 font-semibold bg-transparent border border-white text-white rounded-full hover:bg-blue-700 transition"
        >
          Home
        </Link>

        <Link
          to="/settings"
          className="p-1 px-3 font-semibold bg-transparent border border-white text-white rounded-full hover:bg-blue-700 transition"
        >
          Settings
        </Link>

        {/* External link → use <a>, not Link */}
        <a
          href="http://10.10.1.200:5000/"
          target="_blank"
          rel="noopener noreferrer"
          className="p-1 px-3 font-semibold bg-transparent border border-white text-white rounded-full hover:bg-blue-700 transition"
        >
          Pressure Gauges
        </a>

        <Link
          to="/logout"
          className="p-1 px-3 font-semibold bg-transparent border border-white text-white rounded-full hover:bg-blue-700 transition"
        >
          Logout
        </Link>
      </nav>
    </header>
  );
}
