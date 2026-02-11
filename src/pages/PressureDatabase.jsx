import { useState, useMemo } from "react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/* ---------- DEVICE NAME MAP ---------- */

const DEVICE_MAP = {
  assembly_clean_room: "Assembly Clean Room",
  production_clean_room: "Production Clean Room",
  fy600: "Pump House",
};

export default function PressureDatabase() {

  const [filters, setFilters] = useState({
    start_date: "",
    start_time: "",
    end_date: "",
    end_time: "",
  });

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deviceFilter, setDeviceFilter] = useState("ALL");

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "asc",
  });

  /* ---------- INPUT HANDLER ---------- */

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  /* ---------- FETCH DATA ---------- */

  const fetchData = async () => {

    if (!filters.start_date || !filters.start_time || !filters.end_date || !filters.end_time) {
      alert("Please fill all fields");
      return;
    }

    const start = `${filters.start_date} ${filters.start_time}:00`;
    const end = `${filters.end_date} ${filters.end_time}:00`;

    if (new Date(end) < new Date(start)) {
      alert("End time must be after start time");
      return;
    }

    setLoading(true);

    const API = import.meta.env.VITE_API_URL;

    try {
      const res = await fetch(
        `${API}/pressure/database/filter?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`
      );

      if (!res.ok) throw new Error();

      const data = await res.json();

      const formatted = data.map((r, i) => ({
        id: i + 1,
        device: DEVICE_MAP[r.device] || r.device || "-",
        value: Number(r.value),
        time: new Date(r.time).toLocaleString(), // timezone safe
      }));

      // big data safety
      setRows(formatted.slice(-2000));

    } catch (err) {
      console.error(err);
      alert("Failed to fetch data");
      setRows([]);
    }

    setLoading(false);
  };

  /* ---------- DEVICE LIST ---------- */

  const devices = useMemo(() => {
    const d = [...new Set(rows.map(r => r.device))];
    return ["ALL", ...d];
  }, [rows]);

  /* ---------- FILTER ---------- */

  const filteredRows = useMemo(() => {
    if (deviceFilter === "ALL") return rows;
    return rows.filter(r => r.device === deviceFilter);
  }, [rows, deviceFilter]);

  /* ---------- SORT ---------- */

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction:
        prev.key === key && prev.direction === "asc"
          ? "desc"
          : "asc",
    }));
  };

  const sortedRows = useMemo(() => {

    if (!sortConfig.key) return filteredRows;

    return [...filteredRows].sort((a, b) => {

      const A = a[sortConfig.key];
      const B = b[sortConfig.key];

      if (typeof A === "number") {
        return sortConfig.direction === "asc" ? A - B : B - A;
      }

      const result = String(A).localeCompare(String(B));
      return sortConfig.direction === "asc" ? result : -result;

    });

  }, [filteredRows, sortConfig]);

  /* ---------- EXPORT EXCEL ---------- */

  const exportExcel = async () => {

    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet("Pressure Data");

    ws.columns = [
      { header: "ID", key: "id", width: 10 },
      { header: "Device", key: "device", width: 25 },
      { header: "Value", key: "value", width: 15 },
      { header: "Timestamp", key: "time", width: 25 },
    ];

    sortedRows.forEach(r => ws.addRow(r));

    ws.getRow(1).eachCell(cell => {
      cell.font = { bold: true, color: { argb: "FFFFFF" }};
      cell.fill = {
        type: "pattern",
        pattern:"solid",
        fgColor:{argb:"1F2937"}
      };
    });

    const buffer = await wb.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), "pressure_data.xlsx");
  };

  /* ---------- EXPORT PDF ---------- */

  const exportPDF = () => {

    const doc = new jsPDF();

    autoTable(doc, {
      head: [["ID","Device","Value","Timestamp"]],
      body: sortedRows.map(r => [
        r.id,
        r.device,
        r.value.toFixed(2),
        r.time,
      ]),
    });

    doc.save("pressure_data.pdf");
  };

  /* ---------- UI ---------- */

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">

      <h2 className="text-2xl font-bold text-center mb-6">
        🗄 Pressure Database
      </h2>

      {/* FILTER PANEL */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input type="date" name="start_date" onChange={handleChange} className="border px-3 py-2 rounded" />
          <input type="time" name="start_time" onChange={handleChange} className="border px-3 py-2 rounded" />
          <input type="date" name="end_date" onChange={handleChange} className="border px-3 py-2 rounded" />
          <input type="time" name="end_time" onChange={handleChange} className="border px-3 py-2 rounded" />
        </div>

        <button
          onClick={fetchData}
          disabled={loading}
          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded disabled:opacity-50"
        >
          {loading ? "⏳ Loading..." : "Search"}
        </button>

      </div>

      {/* FILTER + EXPORT */}
      {rows.length > 0 && (
        <div className="flex flex-wrap gap-3 mb-3">

          <select
            value={deviceFilter}
            onChange={(e)=>setDeviceFilter(e.target.value)}
            className="border px-3 py-2 rounded"
          >
            {devices.map(d=>(<option key={d}>{d}</option>))}
          </select>

          <button onClick={exportExcel} className="bg-green-600 text-white px-4 py-2 rounded">
            📗 Excel
          </button>

          <button onClick={exportPDF} className="bg-red-600 text-white px-4 py-2 rounded">
            📕 PDF
          </button>

        </div>
      )}

      {/* TABLE */}
      {sortedRows.length > 0 && (
        <div className="bg-white shadow rounded-lg max-h-125 overflow-y-auto">

          <table className="min-w-full text-center">

            <thead className="bg-gray-800 text-white sticky top-0">
              <tr>
                {["id","device","value","time"].map(k=>(
                  <th key={k} onClick={()=>handleSort(k)} className="py-3 cursor-pointer">
                    {k.toUpperCase()}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {sortedRows.map(r=>(
                <tr key={r.id} className="border-b hover:bg-gray-100">
                  <td>{r.id}</td>
                  <td>{r.device}</td>
                  <td>{r.value.toFixed(2)}</td>
                  <td>{r.time}</td>
                </tr>
              ))}
            </tbody>

          </table>

        </div>
      )}

    </div>
  );
}
