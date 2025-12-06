import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS = ["#3b82f6", "#22c55e", "#eab308", "#ef4444", "#a855f7"];

export default function AllocationPieChart({ data }) {
  return (
    <div style={{ background: "#0f172a", padding: "20px", borderRadius: "10px", marginTop: "30px" }}>
      <h2 style={{ color: "white", marginBottom: "10px" }}>Asset Allocation</h2>

      <PieChart width={450} height={350}>
        <Pie
          data={data}
          dataKey="value"
          nameKey="symbol"
          cx="50%"
          cy="50%"
          outerRadius={120}
          label
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>

        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
}
