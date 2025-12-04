import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts"

function PortfolioChart({ data }) {
  return (
    <div
      style={{
        width: "100%",
        height: "200px",
        background: "rgba(255, 255, 255, 0.05)",
        backdropFilter: "blur(10px)",
        borderRadius: "16px",
        padding: "20px",
        border: "1px solid rgba(255, 255, 255, 0.15)",
        boxShadow: "0 8px 32px rgba(0, 212, 255, 0.08)",
        animation: "fadeIn 0.6s ease-out",
      }}
    >
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>

      <h3
        style={{
          marginTop: "-10px",
          marginBottom: "15px",
          color: "#00d4ff",
          fontSize: "18px",
          fontWeight: "600",
        }}
      >
        ₿ Bitcoin Price 24H
      </h3>

      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="btcGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00d4ff" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#00d4ff" stopOpacity={0.05} />
            </linearGradient>
          </defs>

          <CartesianGrid horizontal={true} vertical={false} strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />

          <XAxis dataKey="time" tick={{ fontSize: 12, fill: "#aaa" }} axisLine={false} tickLine={false} />

          <YAxis
            tick={{ fontSize: 12, fill: "#aaa" }}
            axisLine={false}
            tickLine={false}
            domain={["dataMin-100", "dataMax+100"]}
          />

          <Tooltip
            contentStyle={{
              background: "rgba(10, 14, 39, 0.95)",
              borderRadius: "10px",
              border: "1px solid #00d4ff",
              color: "#fff",
              boxShadow: "0 4px 20px rgba(0, 212, 255, 0.2)",
            }}
            labelStyle={{ color: "#00d4ff" }}
          />

          <Area
            type="linear"
            dataKey="price"
            stroke="#00d4ff"
            strokeWidth={2.5}
            fill="url(#btcGradient)"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export default PortfolioChart
