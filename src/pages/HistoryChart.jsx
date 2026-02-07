import { useEffect, useRef, useState, useMemo } from "react";
import { Chart } from "chart.js/auto";
import zoomPlugin from "chartjs-plugin-zoom";
import "chartjs-adapter-moment";

Chart.register(zoomPlugin);

const COLORS = [
  "#2563eb",
  "#16a34a",
  "#dc2626",
  "#ca8a04",
  "#0891b2",
];

export default function HistoryChart() {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    start_date: "",
    start_time: "",
    end_date: "",
    end_time: "",
  });

  /* ---------------- FILTER HANDLERS ---------------- */

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const validateRange = () => {
    if (
      !filters.start_date ||
      !filters.start_time ||
      !filters.end_date ||
      !filters.end_time
    ) {
      setError("Select all date & time fields");
      return false;
    }

    const start = new Date(`${filters.start_date}T${filters.start_time}`);
    const end = new Date(`${filters.end_date}T${filters.end_time}`);

    if (end <= start) {
      setError("End time must be after start time");
      return false;
    }

    return true;
  };

  /* ---------------- FETCH HISTORY ---------------- */

  const fetchHistory = async () => {
    if (!validateRange()) return;

    setLoading(true);
    setError(null);

    try {
      const start = `${filters.start_date} ${filters.start_time}:00`;
      const end = `${filters.end_date} ${filters.end_time}:00`;

      // ✅ USE VITE PROXY
      const res = await fetch(
        `/api/modbus/database/filter?start=${start}&end=${end}`
      );

      if (!res.ok) throw new Error("Failed to load history data");

      const data = await res.json();
      setRows(data);
    } catch (err) {
      setError("Failed to fetch data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- PREPARE CHART DATA ---------------- */

  const chartData = useMemo(() => {
    const map = {};
    let colorIndex = 0;

    rows.forEach((r) => {
      if (!r.device || r.value == null || !r.time) return;

      if (!map[r.device]) {
        map[r.device] = {
          label: r.device,
          data: [],
          borderColor: COLORS[colorIndex % COLORS.length],
          backgroundColor: COLORS[colorIndex % COLORS.length] + "33",
          tension: 0.4,
          fill: true,
          pointRadius: 1,
        };
        colorIndex++;
      }

      // 🔥 Convert backend time → JS Date
      const fixedTime = new Date(r.time.replace(" ", "T"));

      map[r.device].data.push({
        x: fixedTime,
        y: r.value,
      });
    });

    return Object.values(map);
  }, [rows]);

  /* ---------------- CREATE / UPDATE CHART ---------------- */

  useEffect(() => {
    if (!canvasRef.current || chartData.length === 0) return;

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    chartRef.current = new Chart(canvasRef.current, {
      type: "line",
      data: { datasets: chartData },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: "nearest",
          intersect: false,
        },
        scales: {
          x: {
            type: "time",
            time: {
              parser: "yyyy-MM-dd HH:mm:ss",
              tooltipFormat: "yyyy-MM-dd HH:mm:ss",
            },
            title: { display: true, text: "Time" },
          },
          y: {
            title: { display: true, text: "Pressure Value" },
          },
        },
        plugins: {
          legend: { display: false },
          zoom: {
            pan: { enabled: true, mode: "x" },
            zoom: {
              wheel: { enabled: true },
              pinch: { enabled: true },
              mode: "x",
            },
          },
        },
      },
    });

    return () => chartRef.current?.destroy();
  }, [chartData]);

  /* ---------------- CSV EXPORT ---------------- */

  const exportCSV = () => {
    let csv = "Device,Timestamp,Value\n";

    rows.forEach((r) => {
      csv += `${r.device},${r.time},${r.value}\n`;
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "pressure_history.csv";
    link.click();
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold text-center mb-6">
        📊 Pressure History Chart
      </h2>

      {/* FILTER */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { name: "start_date", type: "date", label: "Start Date" },
            { name: "start_time", type: "time", label: "Start Time" },
            { name: "end_date", type: "date", label: "End Date" },
            { name: "end_time", type: "time", label: "End Time" },
          ].map((f) => (
            <div key={f.name}>
              <label className="text-sm font-semibold">
                {f.label}
              </label>
              <input
                type={f.type}
                name={f.name}
                value={filters[f.name]}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 mt-1"
              />
            </div>
          ))}
        </div>

        {error && <p className="text-red-600 mt-3">{error}</p>}

        <button
          onClick={fetchHistory}
          disabled={loading}
          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded"
        >
          {loading ? "Loading..." : "Load History"}
        </button>
      </div>

      {/* CHART */}
      {chartData.length > 0 && (
        <>
          <div className="flex justify-between mb-2">
            <p>Devices: {chartData.length}</p>

            <div className="flex gap-2">
              <button
                onClick={exportCSV}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Export CSV
              </button>

              <button
                onClick={() => chartRef.current?.resetZoom()}
                className="bg-gray-600 text-white px-4 py-2 rounded"
              >
                Reset Zoom
              </button>
            </div>
          </div>

          {/* LEGEND */}
          <div className="flex flex-wrap gap-4 mb-3">
            {chartData.map((d) => (
              <div key={d.label} className="flex items-center gap-2 text-sm">
                <span
                  className="w-3 h-3 rounded"
                  style={{ background: d.borderColor }}
                />
                {d.label}
              </div>
            ))}
          </div>

          <div className="bg-white shadow rounded-lg p-4 h-96">
            <canvas ref={canvasRef} />
          </div>
        </>
      )}

      {!loading && rows.length === 0 && (
        <p className="text-center text-gray-500 mt-10">
          Select a date range and load history.
        </p>
      )}
    </div>
  );
}
