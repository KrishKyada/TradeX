import Sparkline from "./sparkline.jsx"

function StatCard({ title, value, subtitle, color1, color2, sparklineData }) {
  return (
    <div
      style={{
        padding: "20px",
        borderRadius: "16px",
        color: "white",
        minWidth: "240px",
        background: `linear-gradient(135deg, ${color1}, ${color2})`,
        boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
        flex: "1",
        position: "relative",
        overflow: "hidden",
        animation: "slideIn 0.6s ease-out",
        transition: "all 0.3s ease",
        cursor: "pointer",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255, 255, 255, 0.15)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-5px)"
        e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,0,0,0.25)"
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)"
        e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.15)"
      }}
    >
      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      <h4 style={{ marginBottom: "5px", fontWeight: "500", fontSize: "14px" }}>{title}</h4>

      <h2 style={{ margin: "0", fontSize: "28px", fontWeight: "700" }}>{value}</h2>

      {sparklineData && sparklineData.length > 0 && (
        <div style={{ marginTop: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
          <Sparkline data={sparklineData} width={150} height={40} color="rgba(255,255,255,0.8)" />
        </div>
      )}

      <p style={{ marginTop: "8px", opacity: 0.85, fontSize: "12px" }}>{subtitle}</p>
    </div>
  )
}

export default StatCard
