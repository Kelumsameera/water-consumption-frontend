import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Brush,
} from "recharts";

import RoundTank from "../components/RoundTank";
import PressureGauge from "../components/PressureGauge";

const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL || "http://localhost:3000";

export default function ProfessionalDashboard() {

  const [pressure, setPressure] = useState({
    production_clean_room: 0,
    assembly_clean_room: 0,
  });

  const [tank, setTank] = useState({
    pv: 0,
    sv: 0,
    output: 0,
  });

  const [history, setHistory] = useState([]);

  useEffect(() => {

    const socket = io(SOCKET_URL, {
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 2000,
      timeout: 5000,
    });

    /* CONNECT */
    socket.on("connect", () =>
      console.log("✅ Connected:", socket.id)
    );

    /* PRESSURE */
    socket.on("modbus_update", (data) => {
      if (!data?.device) return;

      const value = Number(data.value) || 0;

      setPressure(prev => ({
        ...prev,
        [data.device]: value,
      }));

      setHistory(prev => {
        const last = prev.at(-1) || {};

        return [
          ...prev.slice(-29),
          {
            time: new Date().toLocaleTimeString(),
            production:
              data.device === "production_clean_room"
                ? value
                : last.production ?? 0,
            assembly:
              data.device === "assembly_clean_room"
                ? value
                : last.assembly ?? 0,
          },
        ];
      });
    });

    /* TANK */
    socket.on("water_tank_update", (data) => {
      setTank({
        pv: Number(data.level) || 0,
        sv: Number(data.setpoint) || 0,
        output: Number(data.output) || 0,
      });
    });

    /* CLEANUP */
    return () => {
      socket.off("modbus_update");
      socket.off("water_tank_update");
      socket.disconnect();
    };

  }, []);

  return (
    <div className="min-h-screen bg-slate-100 p-4 lg:p-10 space-y-10 max-w-7xl mx-auto">

      {/* STAT CARDS */}
      <div className="flex flex-col lg:flex-row flex-wrap gap-6">
        <StatCard
          title="Production Pressure"
          value={pressure.production_clean_room}
          unit="Pa"
        />
        <StatCard
          title="Assembly Pressure"
          value={pressure.assembly_clean_room}
          unit="Pa"
        />
        <StatCard
          title="Tank Level"
          value={tank.pv}
          unit="cm"
        />
      </div>

      {/* GAUGES */}
      <div className="flex flex-col lg:flex-row  gap-8 justify-between">
        <PressureGauge
          value={pressure.production_clean_room}
          label="Production"
        />
        <h3 className="top-20 gap-11">Production</h3>
        <PressureGauge
          value={pressure.assembly_clean_room}
          label="Assembly"
        />
        <div className="flex flex-col lg:flex-row flex-wrap gap-8 justify-between">
        <RoundTank
          pv={tank.pv}
          sv={tank.sv}
          output={tank.output}
        />
      </div>

      </div>

      {/* TANK */}
      
      {/* CHART */}
      <div className="bg-white p-4 lg:p-6 rounded-xl shadow-lg w-full">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={history}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.3}/>
            <XAxis dataKey="time"/>
            <YAxis domain={["auto","auto"]}/>
            <Tooltip/>
            <Legend/>

            <Line
              type="monotone"
              dataKey="production"
              name="Production Clean Room"
              stroke="#2563eb"
              strokeWidth={3}
              dot={false}
            />

            <Line
              type="monotone"
              dataKey="assembly"
              name="Assembly Clean Room"
              stroke="#16a34a"
              strokeWidth={3}
              dot={false}
            />

            <Brush dataKey="time" height={30}/>
          </LineChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}

/* STAT CARD */
function StatCard({ title, value, unit }) {
  return (
    <div className="
      bg-white p-6 rounded-xl shadow
      flex-1 min-w-62.5
    ">
      <div className="text-gray-500 text-sm lg:text-base">
        {title}
      </div>

      <div className="text-2xl lg:text-3xl font-bold mt-2">
        {value} {unit}
      </div>
    </div>
  );
}
