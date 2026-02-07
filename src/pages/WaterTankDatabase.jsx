import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function WaterTankDatabase() {

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ================= FETCH DATA =================
  const fetchData = async () => {

    if (!startDate || !endDate) {
      setError("Please select start and end date");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const format = d =>
        d.toISOString().slice(0,19).replace("T"," ");

      const start = format(startDate);
      const end = format(endDate);

      // ✅ USE PROXY API (like pressure DB)
      const res = await fetch(
        `/api/water-tank/database/filter?start=${start}&end=${end}`
      );

      if (!res.ok) throw new Error();

      const data = await res.json();

      const formatted = data.map((r,i)=>({
        id: i + 1,
        level: Number(r.value).toFixed(2),
        time: r.time,
      }));

      setRows(formatted);

      if (formatted.length === 0) {
        setError("No data found");
      }

    } catch {
      setError("Failed to fetch data");
    }

    setLoading(false);
  };

  // ================= EXCEL EXPORT =================
  const exportExcel = async () => {

    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet("Water Tank Data");

    ws.columns = [
      { header:"ID", key:"id", width:10 },
      { header:"Water Level", key:"level", width:20 },
      { header:"Timestamp", key:"time", width:30 },
    ];

    rows.forEach(r => ws.addRow(r));
    ws.getRow(1).font = { bold:true };

    const buffer = await wb.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), "water-tank-data.xlsx");
  };

  // ================= PDF EXPORT =================
  const exportPDF = () => {

    const doc = new jsPDF();

    autoTable(doc,{
      head:[["ID","Water Level","Timestamp"]],
      body: rows.map(r=>[
        r.id,
        r.level,
        r.time
      ]),
    });

    doc.save("water-tank-data.pdf");
  };

  // ================= UI =================
  return (
    <div className="max-w-6xl mx-auto p-6">

      <h1 className="text-2xl font-bold text-center mb-6">
        💧 Water Tank Database
      </h1>

      {/* FILTER */}
      <div className="flex flex-wrap gap-4 mb-6 items-end">

        <div>
          <label className="font-semibold">Start</label>
          <DatePicker
            selected={startDate}
            onChange={setStartDate}
            showTimeSelect
            dateFormat="yyyy-MM-dd HH:mm:ss"
            className="border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="font-semibold">End</label>
          <DatePicker
            selected={endDate}
            onChange={setEndDate}
            showTimeSelect
            dateFormat="yyyy-MM-dd HH:mm:ss"
            className="border px-3 py-2 rounded"
          />
        </div>

        <button
          onClick={fetchData}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
        >
          {loading ? "Loading..." : "Search"}
        </button>

        {rows.length > 0 && (
          <>
            <button
              onClick={exportExcel}
              className="bg-green-600 text-white px-6 py-2 rounded"
            >
              Export Excel
            </button>

            <button
              onClick={exportPDF}
              className="bg-red-600 text-white px-6 py-2 rounded"
            >
              Export PDF
            </button>
          </>
        )}

      </div>

      {/* ERROR */}
      {error && (
        <p className="text-red-600 text-center mb-4">
          {error}
        </p>
      )}

      {/* SCROLLABLE TABLE */}
      {rows.length > 0 && (
        <div className="bg-white shadow rounded-lg">

          <div className="max-h-125 overflow-y-auto">

            <table className="min-w-full text-center">

              <thead className="bg-blue-700 text-white sticky top-0">
                <tr>
                  <th className="p-3">ID</th>
                  <th>Water Level</th>
                  <th>Timestamp</th>
                </tr>
              </thead>

              <tbody>
                {rows.map(r => (
                  <tr
                    key={r.id}
                    className="border-b hover:bg-gray-100"
                  >
                    <td className="p-2">{r.id}</td>
                    <td>{r.level}</td>
                    <td>{r.time}</td>
                  </tr>
                ))}
              </tbody>

            </table>

          </div>

        </div>
      )}

    </div>
  );
}
