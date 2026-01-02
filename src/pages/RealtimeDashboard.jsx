import { useEffect, useState } from "react";
import RoundTank from "../components/RoundTank";
import BarChartPanel from "../components/BarChartPanel";


const API_BASE = "http://192.168.0.97:8000";

export default function RealtimeDashboard() {
  const [data, setData] = useState({
    pv: 0,
    sv: 0,
    output: 0,
    status: "disconnected",
  });

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`${API_BASE}/fy600`);
      const json = await res.json();
      setData(json);
    };

    fetchData();
    const t = setInterval(fetchData, 2000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="min-h-screen w-full flex flex-col bg-linear-to-br from-slate-50 via-blue-50 to-slate-100 p-6 lg:p-12">
      
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
        <div>
          <h1 className="text-md lg:text-3xl font-semibold text-slate-900 mb-2">
            💧 Water Tank Control
          </h1>
          <p className="text-slate-600 text-lg">
            Real-time monitoring system
          </p>
        </div>

        <div className="flex items-center gap-3 mt-4 lg:mt-0 px-6 py-3 rounded-full bg-white shadow-lg border border-slate-200">
          <div
            className={`w-3 h-3 rounded-full ${
              data.status === "connected" ? "bg-green-500" : "bg-red-500"
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

      {/* MAIN CONTENT (fills page) */}
      <div className="flex flex-col lg:flex-row gap-6  w-full">
        
        {/* LEFT – TANK */}
        <div className="flex justify-center items-center bg-white rounded-2xl shadow-2xl border border-slate-200 p-2 lg:w-2/5">
          <RoundTank level={data.pv ?? 0} label="Main Tank" />
        </div>

        <div className="flex flex-col lg:w-3/5 h-full">
        <BarChartPanel
            pv={data.pv}
            sv={data.sv}
            output={data.output}
        />
        </div>


      </div>
    </div>
  );
}
