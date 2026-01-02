import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export function Chart({ chartData }) {
  return (
    <div className="bg-white shadow-lg rounded-xl p-4 w-100 h-65">
      <h3 className="text-lg font-semibold mb-2">📈 Water Level Trend</h3>

      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis domain={[0, 100]} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="pv"
            stroke="#2563eb"
            strokeWidth={2}
            dot={false}
            name="Water Level (%)"
          />
          <Line
            type="monotone"
            dataKey="sv"
            stroke="#16a34a"
            strokeDasharray="5 5"
            dot={false}
            name="Setpoint (%)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
