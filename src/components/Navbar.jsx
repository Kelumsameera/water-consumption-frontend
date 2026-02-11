import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { FaBell, FaBars, FaTimes } from "react-icons/fa";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const links = [
    { to: "/", label: "Home" },
    { to: "/dashboard", label: "Dashboard" },
    { to: "/water", label: "Water" },
    { to: "/pressure", label: "Pressure" },
    { to: "/chart", label: "Charts" },
    { to: "/database", label: "Database" },
    { to: "/history", label: "History" },
    { to: "/waterdb", label: "Water DB" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* NAVBAR */}
      <header className="bg-blue-600 sticky top-0 z-50 px-4 py-3 flex items-center justify-between text-white">

        {/* Logo */}
        <div className="flex items-center gap-3">
          <img src="/logo.svg" alt="logo" className="w-8 h-8" />
          <h1 className="font-bold text-lg hidden sm:block">
            Monitoring System
          </h1>
        </div>

        {/* Desktop Links */}
        <nav className="hidden lg:flex gap-3">
          {links.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`px-4 py-2 rounded-full hover:bg-blue-700 transition ${
                isActive(item.to) ? "bg-white rounded-full text-blue-700 font-semibold" : ""
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right */}
        <div className="flex items-center gap-4">
          <FaBell className="text-xl cursor-pointer" />

          <button
            className="lg:hidden text-2xl"
            onClick={() => setOpen(true)}
          >
            <FaBars />
          </button>
        </div>
      </header>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-blue-900 z-50
        transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <button
          className="absolute top-4 right-4 text-white text-xl"
          onClick={() => setOpen(false)}
        >
          <FaTimes />
        </button>

        <nav className="flex flex-col gap-4 p-6 mt-12">
          {links.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className={`text-gray-200 hover:text-white p-3 rounded hover:bg-blue-700 ${
                isActive(item.to)
                  ? "bg-blue-800 text-white font-semibold"
                  : ""
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}
