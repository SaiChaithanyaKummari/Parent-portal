/** Icon + label + value quick-info row used in sidebars */
export default function QuickInfo({ icon, label, value }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", textAlign: "left" }}>
      <span style={{ fontSize: "18px", flexShrink: 0, marginTop: "1px", display: "flex", alignItems: "center", color: "#8ea3c3" }}>{icon}</span>
      <div>
        <div style={{ fontSize: "10px", color: "#8ea3c3", fontWeight: 600, letterSpacing: "0.8px", textTransform: "uppercase", marginBottom: "2px" }}>{label}</div>
        <div style={{ fontSize: "13px", color: "#fff", fontWeight: 600 }}>{value}</div>
      </div>
    </div>
  );
}
