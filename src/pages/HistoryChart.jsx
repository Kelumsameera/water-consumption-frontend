import { useEffect, useRef, useState, useMemo } from "react";
import { Chart } from "chart.js/auto";
import zoomPlugin from "chartjs-plugin-zoom";
import "chartjs-adapter-moment";

Chart.register(zoomPlugin);

const COLORS = ["#2563eb","#16a34a","#dc2626","#ca8a04","#0891b2"];

const API =
  import.meta.env.VITE_API_URL || "http://localhost:3000";

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

  /* ---------- HANDLERS ---------- */

  const handleChange = e =>
    setFilters({...filters,[e.target.name]:e.target.value});

  const validateRange = () => {
    if (!Object.values(filters).every(Boolean)) {
      setError("Select all date & time fields");
      return false;
    }

    const start=new Date(`${filters.start_date}T${filters.start_time}`);
    const end=new Date(`${filters.end_date}T${filters.end_time}`);

    if (end<=start){
      setError("End must be after start");
      return false;
    }

    return true;
  };

  /* ---------- FETCH ---------- */

  const fetchHistory = async () => {

    if (!validateRange()) return;

    setLoading(true);
    setError(null);

    try{
      const start=`${filters.start_date} ${filters.start_time}:00`;
      const end=`${filters.end_date} ${filters.end_time}:00`;

      const res=await fetch(
        `${API}/pressure/database/filter?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`
      );

      if(!res.ok) throw new Error();

      const data=await res.json();

      // Big data safety
      setRows(data.slice(-5000));

    }catch{
      setError("Fetch failed");
      setRows([]);
    }

    setLoading(false);
  };

  /* ---------- PREP DATA ---------- */

  const chartData = useMemo(()=>{

    const map={};
    let i=0;

    rows.forEach(r=>{

      if(!r.device||r.value==null||!r.time) return;

      if(!map[r.device]){
        map[r.device]={
          label:r.device,
          data:[],
          borderColor:COLORS[i%COLORS.length],
          backgroundColor:COLORS[i%COLORS.length]+"33",
          fill:true,
          tension:0.4,
          pointRadius:1,
        };
        i++;
      }

      map[r.device].data.push({
        x:new Date(r.time),
        y:Number(r.value)||0,
      });

    });

    return Object.values(map);

  },[rows]);

  /* ---------- CHART ---------- */

  useEffect(()=>{

    if(!canvasRef.current) return;

    if(chartRef.current){
      chartRef.current.destroy();
      chartRef.current=null;
    }

    if(chartData.length===0) return;

    chartRef.current=new Chart(canvasRef.current,{
      type:"line",
      data:{datasets:chartData},
      options:{
        responsive:true,
        maintainAspectRatio:false,
        interaction:{mode:"nearest",intersect:false},
        scales:{
          x:{type:"time",title:{display:true,text:"Time"}},
          y:{title:{display:true,text:"Pressure"}},
        },
        plugins:{
          legend:{display:false},
          zoom:{
            pan:{enabled:true,mode:"x"},
            zoom:{
              wheel:{enabled:true},
              pinch:{enabled:true},
              mode:"x",
            },
          },
        },
      },
    });

    return ()=>chartRef.current?.destroy();

  },[chartData]);

  /* ---------- CSV ---------- */

  const exportCSV=()=>{
    let csv="Device,Timestamp,Value\n";
    rows.forEach(r=>{
      csv+=`${r.device},${r.time},${r.value}\n`;
    });

    const blob=new Blob([csv],{type:"text/csv"});
    const url=URL.createObjectURL(blob);
    const a=document.createElement("a");
    a.href=url;
    a.download="pressure_history.csv";
    a.click();
  };

  /* ---------- UI ---------- */

  return(
  <div className="max-w-7xl mx-auto px-4 py-6">

    <h2 className="text-2xl font-bold text-center mb-6">
      📊 Pressure History Chart
    </h2>

    {/* FILTER */}
    <div className="bg-white shadow p-6 mb-6 rounded-lg">
      <div className="grid md:grid-cols-4 gap-4">

        {["start_date","start_time","end_date","end_time"].map(f=>(
          <input
            key={f}
            type={f.includes("date")?"date":"time"}
            name={f}
            value={filters[f]}
            onChange={handleChange}
            className="border px-3 py-2 rounded"
          />
        ))}

      </div>

      {error && <p className="text-red-600 mt-2">{error}</p>}

      <button
        onClick={fetchHistory}
        disabled={loading}
        className="mt-4 bg-blue-600 text-white px-6 py-2 rounded disabled:opacity-50"
      >
        {loading?"⏳ Loading":"Load History"}
      </button>
    </div>

    {/* CHART */}
    {chartData.length>0&&(
      <>
        <div className="flex justify-between mb-2">
          <p>Devices: {chartData.length}</p>
          <div className="flex gap-2">
            <button onClick={exportCSV} className="bg-green-600 text-white px-4 py-2 rounded">
              CSV
            </button>
            <button onClick={()=>chartRef.current?.resetZoom()}
              className="bg-gray-600 text-white px-4 py-2 rounded">
              Reset Zoom
            </button>
          </div>
        </div>

        <div className="bg-white shadow p-4 h-96 rounded-lg">
          <canvas ref={canvasRef}/>
        </div>
      </>
    )}

    {!loading&&rows.length===0&&(
      <p className="text-center text-gray-500 mt-10">
        Select range & load data
      </p>
    )}

  </div>
  );
}
