import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import PressureGauge from "../components/PressureGauge";

export default function PressurGuageHomePage() {

  const [values, setValues] = useState({
    production_clean_room: 0,
    assembly_clean_room: 0,
  });

  useEffect(() => {

    const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3000";

    const socket = io(SOCKET_URL, {
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 2000,
      timeout: 5000,
    });

    /* CONNECT */
    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
    });

    /* ERROR */
    socket.on("connect_error", (err) => {
      console.log("❌ Socket error:", err.message);
    });

    /* DATA */
    socket.on("modbus_update", (data) => {

      if (!data?.device) return;

      setValues(prev => ({
        ...prev,
        [data.device]: Number(data.value) || 0,
      }));
    });

    /* DISCONNECT */
    socket.on("disconnect", (reason) => {
      console.log("⚠️ Socket disconnected:", reason);
    });

    /* CLEANUP */
    return () => {
      socket.off("connect");
      socket.off("connect_error");
      socket.off("modbus_update");
      socket.off("disconnect");
      socket.disconnect();
    };

  }, []);

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10">

      <h1 className="text-center text-gray-700 text-2xl font-bold mb-8">
        Pressure Monitoring Dashboard
      </h1>

      <div className="flex flex-col lg:flex-row gap-16 justify-center place-items-center">

        {/* PRODUCTION */}
        <div className="w-md lg:w-full max-w-md bg-gray-300 rounded-3xl p-6 shadow-2xl">
          <div
            className="bg-white rounded-full p-6 flex justify-center"
            style={{
              boxShadow:
                "inset 6px 6px 12px rgba(0,0,0,0.25), inset -6px -6px 12px rgba(255,255,255,0.9)",
            }}
          >
            <PressureGauge value={values.production_clean_room} />
          </div>

          <div className="mt-6 text-center text-xl font-semibold">
            Production Clean Room
          </div>
        </div>

        {/* ASSEMBLY */}
        <div className="w-md lg:w-full max-w-md bg-gray-300 rounded-3xl p-6 shadow-2xl">
          <div
            className="bg-white rounded-full p-6 flex justify-center"
            style={{
              boxShadow:
                "inset 6px 6px 12px rgba(0,0,0,0.25), inset -6px -6px 12px rgba(255,255,255,0.9)",
            }}
          >
            <PressureGauge value={values.assembly_clean_room} />
          </div>

          <div className="mt-6 text-center text-xl font-semibold">
            Assembly Clean Room
          </div>
        </div>

      </div>
    </div>
  );
}
