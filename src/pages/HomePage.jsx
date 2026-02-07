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
  FaWater,
  FaTemperatureHigh,
  FaCloud,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";
import { MdWaterDrop, MdSpeed, MdTrendingUp } from "react-icons/md";

export default function HomePage() {
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

  // System stats for the dashboard
  const systemStats = [
    { 
      icon: <MdWaterDrop className="text-4xl" />, 
      title: "Water Level", 
      value: "82%", 
      status: "Normal",
      statusColor: "text-green-500",
      bgColor: "from-blue-500 to-blue-600"
    },
    { 
      icon: <FaTachometerAlt className="text-4xl" />, 
      title: "Pressure", 
      value: "125 PSI", 
      status: "Alert",
      statusColor: "text-yellow-500",
      bgColor: "from-orange-500 to-orange-600"
    },
    { 
      icon: <FaTemperatureHigh className="text-4xl" />, 
      title: "Temperature", 
      value: "28°C", 
      status: "Normal",
      statusColor: "text-green-500",
      bgColor: "from-red-500 to-red-600"
    },
    { 
      icon: <MdSpeed className="text-4xl" />, 
      title: "Flow Rate", 
      value: "45 L/min", 
      status: "Normal",
      statusColor: "text-green-500",
      bgColor: "from-purple-500 to-purple-600"
    },
  ];

  const quickActions = [
    { to: "/water", label: "Monitor Water", icon: <FaWater />, color: "bg-blue-600 hover:bg-blue-700" },
    { to: "/pressur", label: "Check Pressure", icon: <FaTachometerAlt />, color: "bg-orange-600 hover:bg-orange-700" },
    { to: "/chart", label: "View Analytics", icon: <FaChartLine />, color: "bg-green-600 hover:bg-green-700" },
    { to: "/database", label: "Database", icon: <FaDatabase />, color: "bg-purple-600 hover:bg-purple-700" },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
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

          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-white rounded-full flex items-center justify-center">
            <FaCloud className="text-blue-600 text-xl" />
          </div>
          <h1 className="text-xs sm:text-sm md:text-base lg:text-xl xl:text-2xl font-bold">
            Flexicare Environmental Monitoring System
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
                <div className="p-4 bg-linear-to-rrom-blue-600 to-blue-800 text-white">
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

      {/* ================= SIDEBAR ================= */}
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

      {/* ================= MAIN CONTENT - HOMEPAGE ================= */}
      <main className="relative">
        {/* Hero Section with Background Image */}
        <div 
          className="relative h-125 bg-cover bg-center bg-no-repeat flex items-center justify-center"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1920&q=80')`
          }}
        >
          <div className="text-center text-white px-4 z-10">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 animate-fade-in">
              Welcome to FEMS
            </h2>
            <p className="text-lg md:text-xl lg:text-2xl mb-8 max-w-3xl mx-auto">
              Real-time Environmental Monitoring & Control System
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link 
                to="/water" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
              >
                Start Monitoring
              </Link>
              <Link 
                to="/chart" 
                className="bg-white hover:bg-gray-100 text-blue-600 px-8 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
              >
                View Analytics
              </Link>
            </div>
          </div>
        </div>

        {/* System Status Cards */}
        <div className="container mx-auto px-4 py-12">
          <h3 className="text-3xl font-bold text-gray-800 mb-8 text-center">System Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {systemStats.map((stat, index) => (
              <div 
                key={index} 
                className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-all duration-300"
              >
                <div className={`bg-linear-to-r ${stat.bgColor} p-6 text-white`}>
                  <div className="flex justify-between items-start">
                    {stat.icon}
                    <span className={`${stat.statusColor} bg-white px-3 py-1 rounded-full text-xs font-semibold`}>
                      {stat.status}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h4 className="text-gray-600 text-sm font-semibold mb-2">{stat.title}</h4>
                  <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <Link
                  key={index}
                  to={action.to}
                  className={`${action.color} text-white p-6 rounded-lg flex flex-col items-center justify-center gap-3 transition-all transform hover:scale-105 shadow-md`}
                >
                  <div className="text-4xl">{action.icon}</div>
                  <span className="font-semibold">{action.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Alerts */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800">Recent Alerts</h3>
              <Link to="/history" className="text-blue-600 hover:text-blue-700 font-semibold text-sm">
                View All
              </Link>
            </div>
            <div className="space-y-4">
              {notifications.slice(0, 3).map((notif) => (
                <div 
                  key={notif.id} 
                  className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className={`mt-1 ${notif.read ? 'text-gray-400' : 'text-yellow-500'}`}>
                    {notif.read ? <FaCheckCircle className="text-xl" /> : <FaExclamationTriangle className="text-xl" />}
                  </div>
                  <div className="flex-1">
                    <p className={`${notif.read ? 'text-gray-600' : 'text-gray-900 font-semibold'}`}>
                      {notif.message}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">{notif.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* System Status Summary */}
          <div className="mt-12 bg-linear-to-r from-blue-600 to-blue-800 rounded-xl shadow-lg p-8 text-white">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div>
                <h3 className="text-2xl font-bold mb-2">System Status: Operational</h3>
                <p className="text-blue-100">All systems functioning normally. Last updated: 2 minutes ago</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold">99.8%</div>
                  <div className="text-sm text-blue-100">Uptime</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">4</div>
                  <div className="text-sm text-blue-100">Active Sensors</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">
                    <MdTrendingUp className="inline" />
                  </div>
                  <div className="text-sm text-blue-100">Performance</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">© 2025 Flexicare-Lanka. All rights reserved.</p>
          <p className="text-xs text-gray-400 mt-2">Flexicare Environmental Monitoring System v2.0</p>
        </div>
      </footer>
    </div>
  );
}