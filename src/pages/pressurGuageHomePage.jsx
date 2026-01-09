import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import PressureGauge from "../components/PressureGauge";

export default function PressurGuageHomePage() {
   const [values, setValues] = useState({
    production_clean_room: 0,
    assembly_clean_room: 0,
  });

  useEffect(() => {
    // ✅ connect to Socket.IO server (NOT REST endpoint)
    const socket = io("http://localhost:3000", {
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
    });

    socket.on("modbus_update", (data) => {
      /*
        data = {
          device: "production_clean_room",
          value: 23.6,
          timestamp: "2026-01-09 12:10:00"
        }
      */
      setValues((prev) => ({
        ...prev,
        [data.device]: data.value,
      }));
    });

    socket.on("disconnect", () => {
      console.log(" Socket disconnected");
    });

    return () => socket.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10">
      <h1 className="hidden lg:block justify-center text-center text-gray-700 text-2xl font-bold mb-8">
        Pressure Monitoring Dashboard
      </h1>
      <h1 className="lg:hidden flex justify-center text-gray-700 text-2xl font-bold mb-2">Pressure Monitoring Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 place-items-center">

        {/* ---------- PRODUCTION ---------- */}
        <div className="w-full max-w-md bg-gray-300 rounded-3xl 00 p-6 shadow-2xl">
          <div
            className="bg-white rounded-full p-6 flex justify-center"
            style={{
              boxShadow:
                "inset 6px 6px 12px rgba(0,0,0,0.25), inset -6px -6px 12px rgba(255,255,255,0.9)",
            }}
          >
            <PressureGauge value={values.production_clean_room} />
          </div>

          <div className="mt-6 text-center border-b-gray-800 backdrop-blur-3xl border-b rounded-2xl shadow-3xl p-0.5 text-shadow-slate-800 text-xl font-semibold">
            Production Clean Room
          </div>
        </div>

        {/* ---------- ASSEMBLY ---------- */}
        <div className="w-full max-w-md bg-gray-300 rounded-3xl p-6 shadow-2xl">
          <div
            className="bg-white rounded-full p-6 flex justify-center"
            style={{
              boxShadow:
                "inset 6px 6px 12px rgba(0,0,0,0.25), inset -6px -6px 12px rgba(255,255,255,0.9)",
            }}
          >
            <PressureGauge value={values.assembly_clean_room} />
          </div>

          <div className="mt-6 text-center border-b-gray-800 backdrop-blur-3xl border-b rounded-2xl shadow-3xl p-0.5 text-shadow-slate-800 text-xl font-semibold">
            Assembly Clean Room
          </div>
        </div>

      </div>
    </div>
  );
}
