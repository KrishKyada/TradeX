function StatCard({ title, value, subtitle, color1, color2 }) {
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
      }}
    >
      <h4 style={{ marginBottom: "5px", fontWeight: "500" }}>{title}</h4>

      <h2 style={{ margin: "0", fontSize: "26px", fontWeight: "700" }}>
        {value}
      </h2>

      <p style={{ marginTop: "8px", opacity: 0.9 }}>{subtitle}</p>
    </div>
  );
}

export default StatCard;
