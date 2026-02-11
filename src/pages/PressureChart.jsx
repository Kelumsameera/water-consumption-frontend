import { useEffect, useRef, useState } from "react";
import { Chart } from "chart.js/auto";
import zoomPlugin from "chartjs-plugin-zoom";
import "chartjs-adapter-moment";
import { io } from "socket.io-client";

Chart.register(zoomPlugin);

const COLORS = ["#2563eb","#16a34a","#dc2626","#ca8a04","#0891b2"];

const MAX_POINTS = 300;          // memory cap
const WINDOW_MS = 2 * 60 * 1000; // 2-minute sliding window

export default function PressureChartAdvanced() {

  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  const datasetsRef = useRef({});
  const colorIndexRef = useRef(0);

  const [legend,setLegend] = useState([]);
  const [paused,setPaused] = useState(false);
  const [autoScale,setAutoScale] = useState(true);

  /* ================= INIT CHART ================= */
  useEffect(()=>{

    const ctx = canvasRef.current.getContext("2d");

    chartRef.current = new Chart(ctx,{
      type:"line",
      data:{datasets:[]},
      options:{
        responsive:true,
        maintainAspectRatio:false,
        animation:false,

        parsing:false,

        interaction:{
          intersect:false,
          mode:"nearest"
        },

        scales:{
          x:{
            type:"time",
            grid:{color:"#eee"},
            title:{display:true,text:"Time"}
          },
          y:{
            grid:{color:"#eee"},
            title:{display:true,text:"Pressure (Pa)"}
          }
        },

        plugins:{
          legend:{display:false},

          tooltip:{
            backgroundColor:"#111",
            padding:12
          },

          /* 🔥 ZOOM + PAN */
          zoom:{
            pan:{enabled:true,mode:"x"},
            zoom:{
              wheel:{enabled:true},
              pinch:{enabled:true},
              mode:"x"
            }
          },

          /* 🔥 DECIMATION */
          decimation:{
            enabled:true,
            algorithm:"lttb",
            samples:100
          }
        }
      }
    });

    return ()=>chartRef.current?.destroy();

  },[]);

  /* ================= SOCKET ================= */
  useEffect(()=>{

    const socket = io("http://10.10.1.200:3000",{
      transports:["websocket"]
    });

    socket.on("modbus_update",(data)=>{

      if(paused) return;

      const chart = chartRef.current;
      if(!chart) return;

      /* CREATE DATASET */
      if(!datasetsRef.current[data.device]){

        const color = COLORS[colorIndexRef.current++ % COLORS.length];

        const gradient = canvasRef.current
          .getContext("2d")
          .createLinearGradient(0,0,0,400);

        gradient.addColorStop(0,color+"55");
        gradient.addColorStop(1,color+"00");

        const ds = {
          label:data.device,
          data:[],
          borderColor:color,
          backgroundColor:gradient,
          tension:0.35,
          fill:true,
          pointRadius:0,
          borderWidth:2
        };

        datasetsRef.current[data.device]=ds;
        chart.data.datasets.push(ds);

        setLegend(p=>[...p,{name:data.device,color}]);
      }

      const dataset = datasetsRef.current[data.device];

      const now = Date.now();

      dataset.data.push({
        x: now,
        y: data.value
      });

      /* SLIDING WINDOW */
      dataset.data = dataset.data.filter(
        p => now - p.x <= WINDOW_MS
      );

      /* MEMORY CAP */
      if(dataset.data.length > MAX_POINTS){
        dataset.data.shift();
      }

      /* AUTO SCALE */
      if(autoScale){
        chart.options.scales.y.min = undefined;
        chart.options.scales.y.max = undefined;
      }

      chart.update("none");
    });

    return ()=>socket.disconnect();

  },[paused,autoScale]);

  /* ================= ACTIONS ================= */

  const exportPNG = ()=>{
    const url = chartRef.current.toBase64Image();
    const a = document.createElement("a");
    a.href=url;
    a.download="pressure-chart.png";
    a.click();
  };

  /* ================= UI ================= */

  return(
  <div className="w-full px-4 py-6">

    <h1 className="text-2xl font-bold text-center mb-4">
      📈 Industrial Pressure Monitor
    </h1>

    {/* LEGEND */}
    <div className="flex flex-wrap justify-center gap-4 mb-3 bg-white shadow p-3 rounded">
      {legend.map(l=>(
        <div key={l.name} className="flex items-center gap-2">
          <span className="w-4 h-4 rounded-full" style={{background:l.color}}/>
          <span className="font-semibold">{l.name}</span>
        </div>
      ))}
    </div>

    {/* CONTROLS */}
    <div className="flex flex-wrap justify-center gap-3 mb-4">

      <button onClick={()=>setPaused(p=>!p)}
        className="px-4 py-2 bg-yellow-500 text-white rounded">
        {paused ? "Resume" : "Pause"}
      </button>

      <button onClick={()=>chartRef.current.resetZoom()}
        className="px-4 py-2 bg-blue-600 text-white rounded">
        Reset Zoom
      </button>

      <button onClick={exportPNG}
        className="px-4 py-2 bg-green-600 text-white rounded">
        Export PNG
      </button>

      <button onClick={()=>setAutoScale(a=>!a)}
        className="px-4 py-2 bg-purple-600 text-white rounded">
        AutoScale: {autoScale ? "ON":"OFF"}
      </button>

    </div>

    {/* CHART */}
    <div className="bg-white shadow rounded p-3 h-105">
      <canvas ref={canvasRef}/>
    </div>

  </div>
  );
}
