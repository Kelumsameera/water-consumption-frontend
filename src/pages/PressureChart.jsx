import React, { useEffect, useRef, useState } from "react";
import { Chart } from "chart.js/auto";
import "chartjs-adapter-moment";
import { io } from "socket.io-client";

const sensorColors = [
  "#007bff",
  "#28a745",
  "#dc3545",
  "#ffc107",
  "#17a2b8",
];

const PressureChart = ({ initialData = [] }) => {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);
  const wrapperRef = useRef(null);

  const [datasets, setDatasets] = useState({});
  const [menuOpen, setMenuOpen] = useState(false);

  /* ---------- INIT DATA ---------- */
  useEffect(() => {
    let colorIndex = 0;
    const map = {};

    initialData.forEach((p) => {
      if (!map[p.device]) {
        const color = sensorColors[colorIndex % sensorColors.length];
        colorIndex++;
        map[p.device] = {
          label: p.device,
          data: [],
          borderColor: color,
          backgroundColor: `${color}33`,
          fill: true,
          tension: 0.1,
        };
      }
      map[p.device].data.push({ x: p.timestamp, y: p.value });
    });

    setDatasets(map);
  }, [initialData]);

  /* ---------- CHART CREATE / UPDATE ---------- */
  useEffect(() => {
    if (!canvasRef.current || Object.keys(datasets).length === 0) return;

    const ctx = canvasRef.current.getContext("2d");
    const chartDatasets = Object.values(datasets);
    const allPoints = chartDatasets.flatMap((d) => d.data);

    const times = allPoints.map((p) => new Date(p.x));
    const minX = times.length ? new Date(Math.min(...times)) : undefined;
    const maxX = times.length ? new Date(Math.max(...times)) : undefined;

    setWrapperWidth(chartDatasets);

    if (chartRef.current) chartRef.current.destroy();

    chartRef.current = new Chart(ctx, {
      type: "line",
      data: { datasets: chartDatasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            type: "time",
            min: minX,
            max: maxX,
            title: { display: true, text: "Timestamp" },
          },
          y: {
            title: { display: true, text: "Value (Pa)" },
          },
        },
        plugins: {
          legend: { display: false },
        },
      },
    });
  }, [datasets]);

  /* ---------- SOCKET.IO LIVE UPDATE ---------- */
  useEffect(() => {
    const socket = io();

    socket.on("modbus_update", (data) => {
      setDatasets((prev) => {
        const copy = { ...prev };
        const colorIndex = Object.keys(copy).length;

        if (!copy[data.device]) {
          const color = sensorColors[colorIndex % sensorColors.length];
          copy[data.device] = {
            label: data.device,
            data: [],
            borderColor: color,
            backgroundColor: `${color}33`,
            fill: true,
            tension: 0.1,
          };
        }

        copy[data.device].data = [
          ...copy[data.device].data,
          { x: new Date().toISOString(), y: data.value },
        ].slice(-50);

        return copy;
      });
    });

    return () => socket.disconnect();
  }, []);

  /* ---------- WIDTH CALC ---------- */
  const setWrapperWidth = (chartDatasets) => {
    if (!wrapperRef.current) return;
    const maxPoints = Math.max(
      ...chartDatasets.map((d) => d.data.length),
      1
    );
    wrapperRef.current.style.width = `${Math.max(800, maxPoints * 15)}px`;
  };

  return (
    <>
      {/* HEADER */}
      <header className="fixed top-0 left-0 w-full bg-blue-600 text-white shadow z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden mr-3 text-xl"
          >
            ☰
          </button>

          <img
            src="https://flexicare.com/wp-content/uploads/Flexicare-Emblem-White.svg"
            alt="logo"
            className="h-6 mr-2"
          />

          <span className="font-semibold mr-auto hidden sm:block">
            Flexicare-Lanka – Pressure Gauge Monitoring
          </span>

          <nav
            className={`${
              menuOpen ? "flex" : "hidden"
            } md:flex flex-col md:flex-row absolute md:static top-full left-0 w-full md:w-auto bg-blue-600 md:bg-transparent`}
          >
            {[
              { label: "Realtime", href: "/" },
              { label: "Database", href: "/database" },
              { label: "Chart", href: "/chart", active: true },
              { label: "History", href: "/history" },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={`px-4 py-2 hover:bg-blue-700 ${
                  item.active ? "font-bold underline" : ""
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      {/* MAIN */}
      <main className="max-w-7xl mx-auto px-4 pt-24 pb-24">
        <h1 className="text-2xl font-bold text-center mb-4 text-gray-800">
          📈 Pressure Gauge Data Chart (Live)
        </h1>

        {/* LEGEND */}
        <div className="flex flex-wrap justify-center gap-4 border rounded-lg bg-white p-3 mb-4 shadow">
          {Object.values(datasets).map((d) => (
            <div key={d.label} className="flex items-center gap-2">
              <span
                className="w-4 h-4 rounded"
                style={{ backgroundColor: d.borderColor }}
              />
              <span className="text-sm font-medium">{d.label}</span>
            </div>
          ))}
        </div>

        {/* CHART */}
        <div className="border rounded-lg bg-white shadow overflow-x-auto">
          <div
            ref={wrapperRef}
            className="h-100 min-w-200 p-2"
          >
            <canvas ref={canvasRef}></canvas>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="fixed bottom-0 left-0 w-full bg-blue-600 text-white text-center py-2">
        © 2025 Flexicare-Lanka – Engineering Team (Sameera & Kelum)
      </footer>
    </>
  );
};

export default PressureChart;
