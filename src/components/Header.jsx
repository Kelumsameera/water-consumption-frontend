import { Link, useLocation } from "react-router-dom";
import { useState, useRef } from "react";
import {
  FaHome,
  FaCog,
  FaTachometerAlt,
  FaSignOutAlt,
  FaBell,
  FaUserCircle,
} from "react-icons/fa";
import { MdWaterDrop } from "react-icons/md";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [alarm] = useState(true);
  const touchStartX = useRef(null);
  const location = useLocation();

  /* ---------- SWIPE CLOSE ---------- */
  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e) => {
    if (!touchStartX.current) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 60) setOpen(false);
    touchStartX.current = null;
  };

  const links = [
    { to: "/", label: "Home", icon: <FaHome /> },
    { to: "/water", label: "Water Level", icon: <MdWaterDrop /> },
    { to: "/pressur", label: "Pressure Gauges", icon: <FaTachometerAlt /> },
    { to: "/settings", label: "Settings", icon: <FaCog /> },
    { to: "/logout", label: "Logout", icon: <FaSignOutAlt /> },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* ================= HEADER ================= */}
      <header className="w-full px-6 py-4 bg-header-bg shadow-md flex items-center justify-between z-40 relative">

        {/* LEFT: LOGO + TITLE */}
        <div className="flex items-center gap-3 text-white font-bold">
          <img src="/logo.svg" alt="logo" className="w-8 h-8" />
          <h1 className="text-sm sm:text-lg lg:text-2xl">
            Real-time Monitoring System
          </h1>
        </div>

        {/* ================= DESKTOP NAV ================= */}
        <nav className="hidden lg:flex items-center gap-6">
          {links.slice(0, 4).map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-2 font-semibold transition
                ${
                  isActive(item.to)
                    ? "text-cyan-300"
                    : "text-white hover:text-cyan-200"
                }`}
            >
              <span className="text-xl">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* RIGHT ICONS (DESKTOP) */}
        <div className="hidden lg:flex items-center gap-6 text-white">
          <div className="relative">
            <FaBell className="text-xl" />
            {alarm && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-600 rounded-full animate-pulse" />
            )}
          </div>
          <FaUserCircle className="text-2xl" />
        </div>

        {/* HAMBURGER (MOBILE) */}
        <button
          className="lg:hidden text-white text-3xl"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
        >
          ☰
        </button>
      </header>

      {/* ================= OVERLAY ================= */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* ================= SIDEBAR (MOBILE) ================= */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-header-bg z-50
        transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"}`}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* PROFILE */}
        <div className="flex items-center gap-4 p-6 border-b border-white/20">
          <FaUserCircle className="text-4xl text-white" />
          <div className="text-white">
            <div className="font-bold">Sameera</div>
            <div className="text-sm opacity-80">Engineer Department</div>
          </div>

          <div className="ml-auto relative">
            <FaBell className="text-xl text-white" />
            {alarm && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-600 rounded-full animate-pulse" />
            )}
          </div>
        </div>

        {/* MENU */}
        <nav className="flex flex-col p-4 gap-2">
          {links.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-4 px-4 py-3 rounded-md font-semibold
                transition hover:bg-blue-700
                ${
                  isActive(item.to)
                    ? "bg-white text-blue-700"
                    : "text-white"
                }`}
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}
