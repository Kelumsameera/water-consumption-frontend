import { useEffect, useState } from "react";
import RoundTank from "../components/RoundTank";
import BarChartPanel from "../components/BarChartPanel";

const API_BASE = "http://10.10.1.200:3000";

export default function WaterDashboard() {
  const [data, setData] = useState({
    pv: 0,
    sv: 0,
    output: 0,
    status: "disconnected",
  });

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const res = await fetch(`${API_BASE}/fy600`);
        if (!res.ok) throw new Error("API not reachable");

        const json = await res.json();
        console.log(json);

        if (!isMounted) return;

        setData({
          pv: json.pv ?? 0,
          sv: json.sv ?? 0,
          output: json.output ?? 0,
          status: json.status ?? "disconnected",
        });
      } catch (err) {
        console.error("API error:", err);
        if (!isMounted) return;

        setData((prev) => ({
          ...prev,
          status: "disconnected",
        }));
      }
    };

    fetchData();
    const timer = setInterval(fetchData, 2000);

    return () => {
      isMounted = false;
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="min-h-screen w-full flex flex-col bg-linear-to-br from-slate-50 via-blue-50 to-slate-100 p-6 lg:p-12">
      
      {/* ================= HEADER ================= */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
        <div>
          <h1 className="text-md lg:text-3xl font-semibold justify-center items-center text-slate-900 mb-1">
            💧 Water Tank Level 
          </h1>
          <p className="text-slate-600 pl-11 text-lg">
            Real-time monitoring system
          </p>
        </div>

        {/* Status badge */}
        <div className="flex items-center gap-3 mt-4 lg:mt-0 px-6 py-3 rounded-full bg-white shadow-lg border border-slate-200">
          <div
            className={`w-3 h-3 rounded-full ${
              data.status === "connected"
                ? "bg-green-500"
                : "bg-red-500"
            }`}
          />
          <span className="font-semibold text-slate-700">Status:</span>
          <span
            className={`font-bold ${
              data.status === "connected"
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {data.status.toUpperCase()}
          </span>
        </div>
      </div>

      {/* ================= MAIN CONTENT ================= */}
      <div className="flex flex-col lg:flex-row gap-6 w-full items-stretch">
        
        {/* LEFT – TANK */}
        <div className="relative flex justify-center items-start bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 lg:w-2/5">
          <RoundTank
            levelCm={Number(data.pv)}
            label="Main Tank"
          />
        </div>

        {/* RIGHT – BAR CHART */}
        <div className="flex flex-col lg:w-3/5 h-full">
          <BarChartPanel
            pv={Number(data.pv)}
            sv={Number(data.sv)}
            output={Number(data.output)}
          />
        </div>

      </div>
    </div>
  );
}
