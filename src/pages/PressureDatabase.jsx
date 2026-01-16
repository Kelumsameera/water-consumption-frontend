import { useState, useMemo } from "react";

const ROWS_PER_PAGE = 10;

export default function PressureDatabase() {
  const [filters, setFilters] = useState({
    start_date: "",
    start_time: "",
    end_date: "",
    end_time: "",
  });

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "asc",
  });

  /* ---------------- FILTER HANDLING ---------------- */

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setError(null);
  };

  const validateRange = () => {
    const start = new Date(`${filters.start_date}T${filters.start_time}`);
    const end = new Date(`${filters.end_date}T${filters.end_time}`);

    if (end <= start) {
      setError("End date/time must be after start date/time");
      return false;
    }

    if (start > new Date()) {
      setError("Start date/time cannot be in the future");
      return false;
    }

    return true;
  };

  /* ---------------- FETCH DATA ---------------- */

  const fetchData = async () => {
    if (!validateRange()) return;

    setLoading(true);
    setError(null);

    try {
      const start = `${filters.start_date} ${filters.start_time}:00`;
      const end = `${filters.end_date} ${filters.end_time}:00`;

      const res = await fetch(
        `http://localhost:3000/modbus/database/filter?start=${start}&end=${end}`
      );

      if (!res.ok) throw new Error("Failed to load data");

      const data = await res.json();

      // Backend → table format
      const formatted = data.map((r, index) => ({
        id: index + 1,
        device: r.device,
        value: Number(r.value).toFixed(2),
        time: r.time,
      }));

      setRows(formatted);
      setCurrentPage(1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- SORTING ---------------- */

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction:
        prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const sortedRows = useMemo(() => {
    if (!sortConfig.key) return rows;

    return [...rows].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];

      if (sortConfig.direction === "asc") {
        return aVal > bVal ? 1 : -1;
      }
      return aVal < bVal ? 1 : -1;
    });
  }, [rows, sortConfig]);

  /* ---------------- PAGINATION ---------------- */

  const totalPages = Math.ceil(sortedRows.length / ROWS_PER_PAGE);

  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * ROWS_PER_PAGE;
    return sortedRows.slice(start, start + ROWS_PER_PAGE);
  }, [sortedRows, currentPage]);

  /* ---------------- CSV EXPORT ---------------- */

  const exportCSV = () => {
    let csv = "ID,Device,Value,Timestamp\n";
    rows.forEach((r) => {
      csv += `${r.id},${r.device},${r.value},${r.time}\n`;
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "pressure_database.csv";
    link.click();
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
        🗄 Pressure Gauge Database
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
              <label className="text-sm font-semibold text-gray-600">
                {f.label}
              </label>
              <input
                type={f.type}
                name={f.name}
                value={filters[f.name]}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}
        </div>

        {error && <p className="text-red-600 mt-3">{error}</p>}

        <button
          onClick={fetchData}
          disabled={loading}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-semibold disabled:opacity-60"
        >
          {loading ? "Loading..." : "Search"}
        </button>
      </div>

      {/* TABLE */}
      {rows.length > 0 && (
        <>
          <div className="flex justify-between items-center mb-3">
            <p className="font-semibold text-gray-700">
              Records: {rows.length}
            </p>
            <button
              onClick={exportCSV}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
            >
              Export CSV
            </button>
          </div>

          <div className="overflow-x-auto bg-white shadow rounded-lg">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-800 text-white">
                <tr>
                  {[
                    { key: "id", label: "ID" },
                    { key: "device", label: "Device" },
                    { key: "value", label: "Value" },
                    { key: "time", label: "Timestamp" },
                  ].map((h) => (
                    <th
                      key={h.key}
                      onClick={() => handleSort(h.key)}
                      className="px-4 py-3 cursor-pointer hover:bg-gray-700"
                    >
                      {h.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginatedRows.map((r) => (
                  <tr
                    key={r.id}
                    className="border-b hover:bg-gray-100 transition"
                  >
                    <td className="px-4 py-2 text-center">{r.id}</td>
                    <td className="px-4 py-2 text-center">{r.device}</td>
                    <td className="px-4 py-2 text-center">{r.value}</td>
                    <td className="px-4 py-2 text-center">{r.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-4 gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setCurrentPage(p)}
                  className={`px-3 py-1 rounded font-semibold ${
                    p === currentPage
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </>
      )}

      {!loading && rows.length === 0 && (
        <p className="text-center text-gray-500 mt-10">
          Select a date range and search.
        </p>
      )}
    </div>
  );
}
