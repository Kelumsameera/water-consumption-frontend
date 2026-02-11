import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import RoundTank from "../components/RoundTank";
import BarChartPanel from "../components/BarChartPanel";

/* 🔧 CHANGE PORT IF NEEDED */
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;


export default function WaterDashboard() {
  const [values, setValues] = useState({
    pv: 0,
    sv: 0,
    output: 0,
    status: "disconnected",
  });

  useEffect(() => {
    const socket = io(SOCKET_URL, {
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 2000,
    });

    /* ---------- CONNECT ---------- */
    socket.on("connect", () => {
      console.log("✅ FY600 Connected:", socket.id);
      setValues(v => ({ ...v, status: "connected" }));
    });

    /* ---------- REALTIME DATA ---------- */
    socket.on("water_tank_update", (data) => {
      console.log("📡 Tank Update:", data);

      setValues({
        pv: Number(data.level) || 0,
        sv: Number(data.setpoint) || 0,
        output: Number(data.output) || 0,
        status: "connected",
      });
    });

    /* ---------- DISCONNECT ---------- */
    socket.on("disconnect", () => {
      console.log("❌ FY600 Disconnected");
      setValues(v => ({ ...v, status: "disconnected" }));
    });

    /* ---------- ERROR ---------- */
    socket.on("connect_error", (err) => {
      console.log("⚠️ Connection error:", err.message);
    });

    return () => socket.disconnect();
  }, []);

  return (
    <div className="min-h-screen w-full flex flex-col bg-linear-to-br from-slate-50 via-blue-50 to-slate-100 p-6 lg:p-12">

      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">

        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-1">
            💧 Water Tank Level
          </h1>
          <p className="text-slate-600 text-lg">
            Real-time monitoring system
          </p>
        </div>

        {/* STATUS BADGE */}
        <div className="flex items-center gap-3 mt-4 lg:mt-0 px-6 py-3 rounded-full bg-white shadow-lg border border-slate-200">

          <div
            className={`w-3 h-3 rounded-full ${
              values.status === "connected"
                ? "bg-green-500"
                : "bg-red-500"
            }`}
          />

          <span className="font-semibold text-slate-700">
            Status:
          </span>

          <span
            className={`font-bold ${
              values.status === "connected"
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {values.status.toUpperCase()}
          </span>
        </div>

      </div>

      {/* MAIN */}
      <div className="flex flex-col lg:flex-row gap-6 w-full items-stretch">

        {/* TANK VIEW */}
        <div className="flex justify-center bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 lg:w-2/5">
          <RoundTank
            levelCm={values.pv}
            label="Main Tank"
            maxHeightCm={250}
          />
        </div>

        {/* CHART PANEL */}
        <div className="flex flex-col lg:w-3/5">
          <BarChartPanel
            pv={values.pv}
            sv={values.sv}
            output={values.output}
          />
        </div>

      </div>
    </div>
  );
}
