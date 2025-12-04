import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  CartesianGrid
} from "recharts";

function PortfolioChart({ data }) {
  return (
    <div
      style={{
        width: "90%",
        height: 180,
        background: "#fff",
        borderRadius: "20px",
        padding: "20px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
      }}
    >
      <h3 style={{ marginTop: "-20px" }}>Bitcoin Price</h3>

      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>

            {/* Remove vertical lines */}
            <CartesianGrid 
            horizontal={true} 
            vertical={false} 
            strokeDasharray="3 3"
            opacity={0.15}
            />

            {/* Axis */}
            <XAxis 
            dataKey="time"
            tick={{ fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            />

            <YAxis
            tick={{ fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            domain={['dataMin-100', 'dataMax+100']}  // zoom Y-axis for spikes
            />

            <Tooltip
            contentStyle={{
                background: "#fff",
                borderRadius: "10px",
                border: "1px solid #ddd",
            }}
            />

            {/* Gradient */}
            <defs>
            <linearGradient id="btcGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ff4d4d" stopOpacity={0.6} />
                <stop offset="100%" stopColor="#ff4d4d" stopOpacity={0.05} />
            </linearGradient>
            </defs>

            {/* SPIKE-style line (IMPORTANT PART) */}
            <Area
            type="linear"            // makes sharp spikes
            dataKey="price"
            stroke="#ff4d4d"
            strokeWidth={2.2}
            fill="url(#btcGradient)"
            strokeLinejoin="round"   // smooth corners
            strokeLinecap="round"
            />

        </AreaChart>
        </ResponsiveContainer>

    </div>
  );
}

export default PortfolioChart;
