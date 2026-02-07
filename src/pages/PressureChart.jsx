import { useEffect, useRef, useState } from "react";
import { Chart } from "chart.js/auto";
import "chartjs-adapter-moment";
import { io } from "socket.io-client";

const COLORS = [
  "#2563eb",
  "#16a34a",
  "#dc2626",
  "#ca8a04",
  "#0891b2",
];

export default function PressureChart() {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  const datasetsRef = useRef({});
  const colorIndexRef = useRef(0);

  const [legend, setLegend] = useState([]);

  /* ================= INIT CHART ================= */
  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");

    chartRef.current = new Chart(ctx, {
      type: "line",
      data: { datasets: [] },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        scales: {
          x: {
            type: "time",
            time: {
              tooltipFormat: "YYYY-MM-DD HH:mm:ss",
            },
            title: { display: true, text: "Time" },
          },
          y: {
            title: { display: true, text: "Pressure (Pa)" },
          },
        },
        plugins: { legend: { display: false } },
      },
    });

    return () => chartRef.current?.destroy();
  }, []);

  /* ================= SOCKET.IO ================= */
  useEffect(() => {
    const socket = io("http://10.10.1.200:3000", {
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log("✅ Realtime socket connected");
    });

    socket.on("modbus_update", (data) => {
      const chart = chartRef.current;
      if (!chart) return;

      // Create dataset if new device
      if (!datasetsRef.current[data.device]) {
        const color = COLORS[colorIndexRef.current++ % COLORS.length];

        const newDataset = {
          label: data.device,
          data: [],
          borderColor: color,
          backgroundColor: `${color}33`,
          tension: 0.25,
          fill: true,
          pointRadius: 0,
        };

        datasetsRef.current[data.device] = newDataset;
        chart.data.datasets.push(newDataset);

        setLegend((prev) => [
          ...prev,
          { name: data.device, color },
        ]);
      }

      // Push new point
      const dataset = datasetsRef.current[data.device];
      dataset.data.push({
        x: data.time,
        y: data.value,
      });

      if (dataset.data.length > 100) {
        dataset.data.shift();
      }

      chart.update("none");
    });

    return () => socket.disconnect();
  }, []);


  /* ================= UI ================= */
  return (
    <div className="w-full mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-center mb-4 text-gray-800">
        📈 Real-time Pressure Monitoring
      </h1>

      {/* CUSTOM LEGEND */}
      <div className="flex flex-wrap justify-center gap-4 mb-3 bg-white shadow p-3 rounded">
        {legend.map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            <span
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-sm font-semibold text-gray-700">
              {item.name}
            </span>
          </div>
        ))}
      </div>

      {/* CHART */}
      <div className="bg-white rounded-lg shadow border p-2 h-105 overflow-x-auto">
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
}
