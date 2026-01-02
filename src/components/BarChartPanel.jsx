import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function BarChartPanel({ pv, sv, output }) {
  const data = [
    { name: "PV", value: pv ?? 0 },
    { name: "SV", value: sv ?? 0 },
    { name: "OUT", value: output ?? 0 },
  ];

  return (
    <div className="bg-white shadow-lg rounded-xl pb-10 p-6 m-6 h-90 lg:h-170">
      <h3 className="text-sm lg:text-lg font-semibold mb-2">📊 Live Values</h3>

      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis domain={[0, 100]} />
          <Tooltip />
          <Bar dataKey="value" fill="#2563eb" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
