import { useState, useMemo } from "react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/* ---------- TODAY DEFAULT ---------- */
const getToday = () => new Date().toISOString().split("T")[0];

export default function WaterTankDatabase() {

  const [filters, setFilters] = useState({
    start_date: getToday(),
    start_time: "00:00",
    end_date: getToday(),
    end_time: "23:59",
  });

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const [deviceFilter, setDeviceFilter] = useState("ALL");
  const [showZeros, setShowZeros] = useState(true);

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

    setLoading(true);

    const API = import.meta.env.VITE_API_URL;

    try {

      const start = `${filters.start_date} ${filters.start_time}:00`;
      const end = `${filters.end_date} ${filters.end_time}:00`;

      const res = await fetch(
        `${API}/water-tank/database/filter?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`
      );

      if (!res.ok) throw new Error();

      const data = await res.json();

      const formatted = data.map((r, i) => {

        let deviceName = r.device === "fy600" ? "Pump House" : r.device;

        return {
          id: i + 1,
          device: deviceName || "-",
          value: Number(r.value), // keep numeric
          time: new Date(r.time).toLocaleString(), // timezone safe
        };
      });

      // Big data safety
      setRows(formatted.slice(-2000));

    } catch {
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

  /* ---------- FILTERED DATA ---------- */
  const filteredRows = useMemo(() => {

    let data = rows;

    if (deviceFilter !== "ALL") {
      data = data.filter(r => r.device === deviceFilter);
    }

    if (!showZeros) {
      data = data.filter(r => r.value !== 0);
    }

    return data;

  }, [rows, deviceFilter, showZeros]);

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
    const ws = wb.addWorksheet("Water Data");

    ws.columns = [
      { header: "ID", key: "id", width: 10 },
      { header: "Device", key: "device", width: 25 },
      { header: "Value", key: "value", width: 15 },
      { header: "Timestamp", key: "time", width: 25 },
    ];

    sortedRows.forEach(r => ws.addRow({
      ...r,
      value: r.value.toFixed(2),
    }));

    ws.getRow(1).font = { bold: true };

    const buffer = await wb.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), "water_data.xlsx");
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

    doc.save("water_data.pdf");
  };

  /* ---------- UI ---------- */
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">

      <h2 className="text-2xl font-bold text-center mb-6">
        💧 Water Tank Database
      </h2>

      <div className="bg-white shadow rounded-lg p-6 mb-6">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input type="date" name="start_date" value={filters.start_date} onChange={handleChange} className="border px-3 py-2 rounded"/>
          <input type="time" name="start_time" value={filters.start_time} onChange={handleChange} className="border px-3 py-2 rounded"/>
          <input type="date" name="end_date" value={filters.end_date} onChange={handleChange} className="border px-3 py-2 rounded"/>
          <input type="time" name="end_time" value={filters.end_time} onChange={handleChange} className="border px-3 py-2 rounded"/>
        </div>

        <button
          onClick={fetchData}
          disabled={loading}
          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded disabled:opacity-50"
        >
          {loading ? "⏳ Loading..." : "Search"}
        </button>
      </div>

      {rows.length > 0 && (
        <div className="flex flex-wrap gap-3 mb-3">

          <select
            value={deviceFilter}
            onChange={(e)=>setDeviceFilter(e.target.value)}
            className="border px-3 py-2 rounded"
          >
            {devices.map(d=>(<option key={d}>{d}</option>))}
          </select>

          <label className="flex items-center gap-2">
            <input type="checkbox" checked={showZeros} onChange={()=>setShowZeros(!showZeros)}/>
            Show Zeros
          </label>

          <button onClick={exportExcel} className="bg-green-600 text-white px-4 py-2 rounded">📗 Excel</button>
          <button onClick={exportPDF} className="bg-red-600 text-white px-4 py-2 rounded">📕 PDF</button>

        </div>
      )}

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
