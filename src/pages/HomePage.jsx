// import { useEffect, useState } from "react";
// import { io } from "socket.io-client";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   Legend,
// } from "recharts";
// import RoundTank from "../components/RoundTank";

// /* ================= SOCKET ================= */
// const socket = io("http://10.10.1.200:5000");
// const API_BASE = "http://10.10.1.200:3000";

// /* ================= PRESSURE GAUGE ================= */
// function PressureGauge({
//   value = 0,
//   min = 0,
//   max = 50,
//   unit = "Pa",
//   size = 260,
//   label = "Pressure",
// }) {
//   const safeValue = Math.min(Math.max(value, min), max);
//   const range = max - min || 1;

//   const cx = size / 2;
//   const cy = size / 2;
//   const arcThickness = 12;
//   const arcGap = 70;
//   const radius = (size - arcThickness - arcGap) / 2;

//   const tickMajor = 20;
//   const tickMinor = 12;
//   const tickMicro = 6;
//   const tickOuterRadius = radius - arcThickness / 2;
//   const labelRadius = tickOuterRadius - 28;

//   const startAngle = 135;
//   const endAngle = 405;
//   const angleRange = endAngle - startAngle;

//   const needleAngle =
//     startAngle + 90 + angleRange * ((safeValue - min) / range);

//   const toRad = (deg) => (deg * Math.PI) / 180;

//   const arcPath = (a1, a2, r) => {
//     const s = toRad(a1);
//     const e = toRad(a2);
//     const x1 = cx + r * Math.cos(s);
//     const y1 = cy + r * Math.sin(s);
//     const x2 = cx + r * Math.cos(e);
//     const y2 = cy + r * Math.sin(e);
//     const large = a2 - a1 > 180 ? 1 : 0;
//     return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
//   };

//   const zones = [
//     { start: 0, end: 5, color: "#d92647" },
//     { start: 5, end: 10, color: "#e08048" },
//     { start: 10, end: 15, color: "#d6d926" },
//     { start: 15, end: 25, color: "#38c749" },
//     { start: 25, end: 35, color: "#e08048" },
//     { start: 35, end: 50, color: "#d92647" },
//   ];

//   return (
//     <div className="flex flex-col items-center">
//       <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
//         <defs>
//           <linearGradient
//             id={`metal-${label}`}
//             x1="0%"
//             y1="0%"
//             x2="0%"
//             y2="100%"
//           >
//             <stop offset="0%" stopColor="#1e293b" />
//             <stop offset="50%" stopColor="#64748b" />
//             <stop offset="100%" stopColor="#334155" />
//           </linearGradient>
//           <linearGradient
//             id={`needle-${label}`}
//             x1="0%"
//             y1="0%"
//             x2="100%"
//             y2="0%"
//           >
//             <stop offset="0%" stopColor="#dc2626" />
//             <stop offset="100%" stopColor="#991b1b" />
//           </linearGradient>
//           <filter id={`glow-${label}`}>
//             <feGaussianBlur stdDeviation="2" result="coloredBlur" />
//             <feMerge>
//               <feMergeNode in="coloredBlur" />
//               <feMergeNode in="SourceGraphic" />
//             </feMerge>
//           </filter>
//         </defs>

//         <circle
//           cx={cx}
//           cy={cy}
//           r={radius + 30}
//           fill="none"
//           stroke={`url(#metal-${label})`}
//           strokeWidth={12}
//         />
//         <circle
//           cx={cx}
//           cy={cy}
//           r={radius + 20}
//           fill="none"
//           stroke="#94a3b8"
//           strokeWidth={2}
//           opacity="0.9"
//         />
//         <circle cx={cx} cy={cy} r={radius + 10} fill="#f8fafc" />

//         {zones.map((z, i) => {
//           const a1 = startAngle + angleRange * (z.start / max);
//           const a2 = startAngle + angleRange * (z.end / max);
//           return (
//             <path
//               key={i}
//               d={arcPath(a1, a2, radius)}
//               stroke={z.color}
//               strokeWidth={arcThickness}
//               strokeLinecap="round"
//               fill="none"
//               opacity="0.9"
//             />
//           );
//         })}

//         {Array.from({ length: 51 }).map((_, i) => {
//           const valueAtTick = min + (range * i) / 50;
//           const pct = (valueAtTick - min) / range;
//           const ang = startAngle + angleRange * pct;
//           const rad = toRad(ang);

//           const isMajor = i % 5 === 0;
//           const inner =
//             radius - arcThickness / 2 - (isMajor ? tickMajor : tickMinor);

//           return (
//             <g key={i}>
//               <line
//                 x1={cx + inner * Math.cos(rad)}
//                 y1={cy + inner * Math.sin(rad)}
//                 x2={cx + tickOuterRadius * Math.cos(rad)}
//                 y2={cy + tickOuterRadius * Math.sin(rad)}
//                 stroke="#475569"
//                 strokeWidth={isMajor ? 2.5 : 1.5}
//               />
//               {isMajor && (
//                 <text
//                   x={cx + labelRadius * Math.cos(rad)}
//                   y={cy + labelRadius * Math.sin(rad)}
//                   fontSize="11"
//                   fontWeight="600"
//                   fill="#1e293b"
//                   textAnchor="middle"
//                   dominantBaseline="middle"
//                 >
//                   {Math.round(valueAtTick)}
//                 </text>
//               )}
//             </g>
//           );
//         })}

//         <text
//           x={cx}
//           y={cy - 40}
//           fontSize="14"
//           fontWeight="700"
//           textAnchor="middle"
//           fill="#475569"
//         >
//           {unit}
//         </text>

//         <g
//           transform={`rotate(${needleAngle} ${cx} ${cy})`}
//           filter={`url(#glow-${label})`}
//         >
//           <polygon
//             points={`${cx},${cy} ${cx - 6},${cy + 8} ${cx + 6},${
//               cy + 8
//             } ${cx},${cy - tickOuterRadius + 5}`}
//             fill={`url(#needle-${label})`}
//           />
//         </g>

//         <circle cx={cx} cy={cy} r={10} fill={`url(#metal-${label})`} />
//         <circle cx={cx} cy={cy} r={5} fill="#dc2626" />

//         <rect
//           x={cx - 40}
//           y={cy + 48}
//           width={78}
//           height={32}
//           rx={8}
//           fill="#1e293b"
//         />
//         <text
//           x={cx}
//           y={cy + 70}
//           fontSize="18"
//           fontWeight="700"
//           textAnchor="middle"
//           fill="#f1f5f9"
//         >
//           {safeValue.toFixed(1)}
//         </text>
//       </svg>
//       <div className="mt-2 text-base font-semibold text-slate-700">{label}</div>
//     </div>
//   );
// }


// function StatCard({ title, value, unit, icon, trend }) {
//   return (
//     <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-shadow">
//       <div className="flex items-center justify-between mb-3">
//         <span className="text-3xl">{icon}</span>
//         {trend && (
//           <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
//             trend > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
//           }`}>
//             {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
//           </span>
//         )}
//       </div>
//       <div className="text-sm font-medium text-slate-600 mb-1">{title}</div>
//       <div className="flex items-baseline gap-2">
//         <span className="text-3xl font-bold text-slate-900">{value}</span>
//         <span className="text-lg font-semibold text-slate-500">{unit}</span>
//       </div>
//     </div>
//   );
// }
// export default function ProfessionalDashboard() {
//   // const [history, setHistory] = useState([]);
//   // const [tankLevel, setTankLevel] = useState(0);

//   // const [pressure, setPressure] = useState({
//   //   production_clean_room: 0,
//   //   assembly_clean_room: 0,
//   // });

//   // const [data, setData] = useState({
//   //   pv: 0,
//   //   sv: 0,
//   //   output: 0,
//   //   status: "disconnected",
//   // });

//   // useEffect(() => {
//   // let isMounted = true;
//  const [values, setValues] = useState({
//     production_clean_room: 0,
//     assembly_clean_room: 0,
//   });

//   useEffect(() => {
//     // ✅ connect to Socket.IO server (NOT REST endpoint)
//     const socket = io("http://localhost:3000", {
//       transports: ["websocket"],
//     });

//     socket.on("connect", () => {
//       console.log("✅ Socket connected:", socket.id);
//     });

//     socket.on("modbus_update", (data) => {
//       /*
//         data = {
//           device: "production_clean_room",
//           value: 23.6,
//           timestamp: "2026-01-09 12:10:00"
//         }
//       */
//       setValues((prev) => ({
//         ...prev,
//         [data.device]: data.value,
//       }));
//     });

//     socket.on("disconnect", () => {
//       console.log(" Socket disconnected");
//     });

//     return () => socket.disconnect();
//   }, []);


//   const fetchData = async () => {
//     try {
//       const res = await fetch(`${API_BASE}/fy600`);
//       if (!res.ok) throw new Error("API not reachable");

//       const json = await res.json();
//       console.log(json);

//       if (!isMounted) return;

//       setData({
//         pv: json.pv ?? 0,
//         sv: json.sv ?? 0,
//         output: json.output ?? 0,
//         status: json.status ?? "disconnected",
//       });

//       // ✅ FIX: update tank level from API
//       setTankLevel(Number(json.pv) || 0);

//     } catch (err) {
//       console.error("API error:", err);
//       if (!isMounted) return;

//       setData((prev) => ({
//         ...prev,
//         status: "disconnected",
//       }));
//     }
//   };

//   fetchData();
//   const timer = setInterval(fetchData, 2000);

//   return () => {
//     isMounted = false;
//     clearInterval(timer);
//   };
// }, []);


//   useEffect(() => {
//     socket.on("modbus_update", (data) => {
//       if (data.device === "production_clean_room") {
//         setPressure((p) => ({
//           ...p,
//           production_clean_room: data.value,
//         }));
//       }

//       if (data.device === "assembly_clean_room") {
//         setPressure((p) => ({
//           ...p,
//           assembly_clean_room: data.value,
//         }));
//       }

      

//       setHistory((prev) => [
//         ...prev.slice(-29),
//         {
//           time: new Date().toLocaleTimeString(),
//           production:
//             data.device === "production_clean_room"
//               ? data.value
//               : pressure.production_clean_room,
//           assembly:
//             data.device === "assembly_clean_room"
//               ? data.value
//               : pressure.assembly_clean_room,
//         },
//       ]);
//     });

//     return () => socket.off("modbus_update");
//   }, []);

//   return (
//     <div className="min-h-screen bg-linear-to-br from-slate-50 via-slate-100 to-blue-50 p-10 space-y-12">
      
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
         
//           <StatCard title="Production Room Pressure" value={pressure.production_clean_room} unit="Pa" icon="⬇️" trend={0.2} />
//           <StatCard title="Assembly Room Pressure" value={pressure.assembly_clean_room} unit="Pa" icon="⬇️" trend={0.8} />
//           <StatCard title="Main Tank Level" value={data.pv} unit="cm" icon="🌊" trend={-1.2} />

//       </div>
//       <div className="flex gap-10 justify-between flex-wrap">
//         <div className="ml-10">
//           <PressureGauge
//           value={pressure.production_clean_room}
//           label="Production Clean Room"
//         />

//         </div>
        

//         <PressureGauge
//           value={pressure.assembly_clean_room}
//           label="Assembly Clean Room"
//         />

//           <div className="mr-10">
//             <RoundTank levelCm={Number(data.pv)} maxHeightCm={250} label="Tube Well Tank" />
//           </div>
          
//       </div>


//       <div className="bg-white rounded-2xl shadow-2xl p-6 border border-slate-200">
//         <h2 className="text-xl font-bold text-slate-800 mb-4">
//           Pressure Trends
//         </h2>

//         <ResponsiveContainer width="100%" height={300}>
//           <LineChart data={history}>
//             <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
//             <XAxis dataKey="time" />
//             <YAxis domain={[0, 50]} />
//             <Tooltip />
//             <Legend />
//             <Line
//               type="monotone"
//               dataKey="production"
//               stroke="#2563eb"
//               strokeWidth={2.5}
//               dot={false}
//             />
//             <Line
//               type="monotone"
//               dataKey="assembly"
//               stroke="#16a34a"
//               strokeWidth={2.5}
//               dot={false}
//             />
//           </LineChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// }


import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import RoundTank from "../components/RoundTank";
import PressureGauge from "../components/PressureGauge";

const SOCKET_URL = "http://localhost:3000";


export default function ProfessionalDashboard() {


    const [values, setValues] = useState({
    pv: 0,
    sv: 0,
    output: 0,
    status: "disconnected",
  });

  useEffect(() => {
  const socket = io("http://localhost:3000", {
    transports: ["websocket"],
  });

  socket.on("fy600_update", (data) => {
    setValues({
      pv: Number(data.pv) || 0,
      sv: Number(data.sv) || 0,
      output: Number(data.output) || 0,
      status: data.status || "connected",
    });
  });

  return () => socket.disconnect();
}, []);

  /* ================= STATE ================= */
  const [pressure, setPressure] = useState({
    production_clean_room: 0,
    assembly_clean_room: 0,
  });

  const [history, setHistory] = useState([]);
  
  const socketRef = useRef(null);

  /* ================= SOCKET.IO (REALTIME PRESSURE) ================= */
  useEffect(() => {
    socketRef.current = io(SOCKET_URL, {
      transports: ["websocket"],
    });

    socketRef.current.on("connect", () => {
      console.log("✅ Socket connected");
    });

    socketRef.current.on("modbus_update", (data) => {
      setPressure((prev) => ({
        ...prev,
        [data.device]: data.value,
      }));

      setHistory((prev) =>
        [
          ...prev.slice(-29),
          {
            time: new Date().toLocaleTimeString(),
            production:
              data.device === "production_clean_room"
                ? data.value
                : prev.at(-1)?.production ?? 0,
            assembly:
              data.device === "assembly_clean_room"
                ? data.value
                : prev.at(-1)?.assembly ?? 0,
          },
        ]
      );
    });

    socketRef.current.on("disconnect", () => {
      console.log(" Socket disconnected");
    });

    return () => socketRef.current.disconnect();
  }, []);

 

    

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-slate-100 p-10 space-y-12">

      {/* ===== STAT CARDS ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <StatCard title="Production Pressure" value={pressure.production_clean_room} unit="Pa" />
        <StatCard title="Assembly Pressure" value={pressure.assembly_clean_room} unit="Pa" />
        <StatCard title="Tank Level" value={values.pv} unit="cm" />
      </div>

      {/* ===== GAUGES ===== */}
      <div className="flex flex-wrap justify-between gap-10">
        
        <div className=" text-xl text-center" >
          <PressureGauge value={pressure.production_clean_room} label="Production Clean Room" />
          <h1>Productin Clean Room</h1>
        </div>
        
        <div className=" text-xl text-center" >
          <PressureGauge value={pressure.assembly_clean_room} label="Assembly Clean Room" />
          <h1>Assembly Clean Room</h1>
        </div>
        <RoundTank levelCm={Number(values.pv)} maxHeightCm={250} label="Tube Well Tank" />
      </div>

      {/* ===== CHART ===== */}
      <div className="bg-white rounded-xl shadow-xl p-6">
        <h2 className="text-xl font-bold mb-4">Pressure Trends</h2>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={history}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis domain={[0, 50]} />
            <Tooltip />
            <Legend />
            <Line dataKey="production" stroke="#2563eb" dot={false} />
            <Line dataKey="assembly" stroke="#16a34a" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

/* ================= SMALL COMPONENT ================= */
function StatCard({ title, value, unit }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="text-3xl font-bold">
        {value} <span className="text-base">{unit}</span>
      </div>
    </div>
  );
}



