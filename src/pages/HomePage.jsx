import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="flex flex-col w-full min-h-screen">
      {/* ================= HERO SECTION ================= */}
      <div className="relative w-full h-screen">
        {/* Logo - TOP CENTER */}
        <img
          src="https://flexicare.com/wp-content/uploads/Flexicare-Emblem-White.svg"
          alt="Logo"
          className="w-32 h-32 absolute top-6 left-1/2 -translate-x-1/2 z-10"
        />

        {/* Background Image */}
        <img src="/bg1.png" alt="Hero" className="object-cover w-full h-full" />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-4xl md:text-6xl font-semibold text-white mb-4">
            flexicare Lanka 
          </h1>
          <p className="text-lg md:text-2xl text-white mb-6">
            Environmental Monitoring System
          </p>

          <Link to="/dashboard">
            <button className="rounded-full bg-white text-black font-bold py-3 px-6 hover:bg-gray-200 transition">
              Get Started
            </button>
          </Link>
          
        </div>
      </div>

      {/* ================= FOOTER ================= */}
      <footer className="bg-gray-800 text-white text-center py-6">
        © {new Date().getFullYear()} Flexicare-Lanka — Environmental Monitoring
        System
      </footer>
    </div>
  );
}
