// 

import { Link, useLocation } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import {
  FaHome,
  FaCog,
  FaTachometerAlt,
  FaSignOutAlt,
  FaBell,
  FaUserCircle,
  FaTimes,
  FaDatabase,
  FaChartLine,
  FaHistory,
} from "react-icons/fa";
import { MdWaterDrop } from "react-icons/md";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, message: "Pressure gauge alert: Gauge-03 exceeded threshold", time: "2 min ago", read: false },
    { id: 2, message: "Water level critical in Tank B", time: "15 min ago", read: false },
    { id: 3, message: "System maintenance scheduled", time: "1 hour ago", read: true },
  ]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const touchStartX = useRef(null);
  const notificationRef = useRef(null);
  const profileRef = useRef(null);
  const location = useLocation();

  const hasUnreadNotifications = notifications.some(n => !n.read);

  /* ---------- CLICK OUTSIDE TO CLOSE ---------- */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfile(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ---------- PREVENT BODY SCROLL WHEN SIDEBAR OPEN ---------- */
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

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

  /* ---------- CLOSE SIDEBAR ON ESC ---------- */
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const links = [
    { to: "/", label: "Home", icon: <FaHome /> },
    { to: "/water", label: "Water Level", icon: <MdWaterDrop /> },
    { to: "/pressur", label: "Pressure Gauges", icon: <FaTachometerAlt /> },
    { to: "/chart", label: "Chart", icon: <FaChartLine /> },
    { to: "/database", label: "Database", icon: <FaDatabase /> },
    { to: "/history", label: "History Chart", icon: <FaHistory /> },
    { to: "/settings", label: "Settings", icon: <FaCog /> },
    { to: "/logout", label: "Logout", icon: <FaSignOutAlt /> },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* ================= HEADER ================= */}
      <header className="w-full px-4 sm:px-6 sticky top-0 py-3 sm:py-4 bg-linear-to-r from-blue-600 to-blue-800 shadow-lg flex items-center justify-between z-40">
        {/* LEFT: LOGO + DESKTOP MENU BUTTON */}
        <div className="flex items-center gap-2 sm:gap-3 text-white font-bold">
          <button
            className="hidden lg:flex text-2xl xl:text-3xl mr-2 hover:bg-blue-700 rounded p-2 transition-colors"
            onClick={() => setOpen(true)}
            aria-label="Open sidebar"
          >
            ☰
          </button>

          <img 
            src="/logo.svg" 
            alt="Flexicare Logo" 
            className="w-7 h-7 sm:w-8 sm:h-8"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          <h1 className="text-xs sm:text-sm md:text-base lg:text-xl xl:text-2xl font-bold">
            Real-time Monitoring System
          </h1>
        </div>

        {/* RIGHT ICONS (DESKTOP) */}
        <div className="hidden lg:flex items-center gap-4 xl:gap-6 text-white">
          {/* Notifications Dropdown */}
          <div className="relative" ref={notificationRef}>
            <button
              className="relative hover:bg-blue-700 p-2 rounded-full transition-colors"
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowProfile(false);
              }}
              aria-label="Notifications"
            >
              <FaBell className="text-xl" />
              {hasUnreadNotifications && (
                <span className="absolute top-1 right-1 w-3 h-3 bg-red-600 rounded-full animate-pulse border-2 border-blue-800" />
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-2xl overflow-hidden z-50">
                <div className="bg-blue-600 text-white px-4 py-3 flex justify-between items-center">
                  <h3 className="font-bold">Notifications</h3>
                  {hasUnreadNotifications && (
                    <button
                      onClick={markAllAsRead}
                      className="text-xs hover:underline"
                    >
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                      No notifications
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={`p-4 border-b hover:bg-gray-50 cursor-pointer transition-colors ${
                          !notif.read ? "bg-blue-50" : ""
                        }`}
                        onClick={() => markAsRead(notif.id)}
                      >
                        <div className="flex justify-between items-start gap-2">
                          <div className="flex-1">
                            <p className={`text-sm ${!notif.read ? "font-semibold text-gray-900" : "text-gray-700"}`}>
                              {notif.message}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              clearNotification(notif.id);
                            }}
                            className="text-gray-400 hover:text-red-600 transition-colors"
                            aria-label="Clear notification"
                          >
                            <FaTimes />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              className="hover:bg-blue-700 p-2 rounded-full transition-colors"
              onClick={() => {
                setShowProfile(!showProfile);
                setShowNotifications(false);
              }}
              aria-label="Profile menu"
            >
              <FaUserCircle className="text-2xl" />
            </button>

            {showProfile && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-2xl overflow-hidden z-50">
                <div className="p-4 bg-linear-to-r from-blue-600 to-blue-800 text-white">
                  <div className="flex items-center gap-3">
                    <FaUserCircle className="text-4xl" />
                    <div>
                      <div className="font-bold">Sameera Kelum</div>
                      <div className="text-sm opacity-90">Engineering Team</div>
                    </div>
                  </div>
                </div>
                <div className="p-2">
                  <Link
                    to="/settings"
                    className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 rounded transition-colors text-gray-700"
                    onClick={() => setShowProfile(false)}
                  >
                    <FaCog />
                    <span>Settings</span>
                  </Link>
                  <Link
                    to="/logout"
                    className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 rounded transition-colors text-red-600"
                    onClick={() => setShowProfile(false)}
                  >
                    <FaSignOutAlt />
                    <span>Logout</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* HAMBURGER (MOBILE) */}
        <button
          className="lg:hidden text-white text-2xl sm:text-3xl hover:bg-blue-700 rounded p-2 transition-colors"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
        >
          ☰
        </button>
      </header>

      {/* ================= OVERLAY ================= */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* ================= SIDEBAR (MOBILE + DESKTOP) ================= */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 sm:w-80 bg-linear-to-b from-blue-700 to-blue-900 z-50
        transform transition-transform duration-300 ease-in-out
        ${open ? "translate-x-0" : "-translate-x-full"}
        shadow-2xl`}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* CLOSE BUTTON */}
        <button
          className="absolute top-4 right-4 text-white text-2xl hover:bg-blue-800 rounded-full p-2 transition-colors"
          onClick={() => setOpen(false)}
          aria-label="Close sidebar"
        >
          <FaTimes />
        </button>

        {/* PROFILE */}
        <div className="flex items-center gap-4 p-6 border-b border-white/20">
          <FaUserCircle className="text-5xl text-white" />
          <div className="text-white flex-1">
            <div className="font-bold text-lg">Sameera Kelum</div>
            <div className="text-sm opacity-90">Engineering Team</div>
            <div className="text-xs opacity-75 mt-1">Flexicare-Lanka</div>
          </div>

          <div className="relative">
            <FaBell className="text-xl text-white" />
            {hasUnreadNotifications && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-600 rounded-full animate-pulse border-2 border-blue-900" />
            )}
          </div>
        </div>

        {/* MENU */}
        <nav className="flex flex-col p-4 gap-2 overflow-y-auto" style={{ maxHeight: "calc(100vh - 140px)" }}>
          {links.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-4 px-4 py-3 rounded-lg font-semibold
              transition-all duration-200 hover:translate-x-1
              ${
                isActive(item.to)
                  ? "bg-white text-blue-700 shadow-md"
                  : "text-white hover:bg-blue-600"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* FOOTER INFO */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/20 bg-blue-900/50">
          <p className="text-xs text-white/80 text-center">
            © 2025 Flexicare-Lanka
          </p>
        </div>
      </aside>
    </>
  );
}