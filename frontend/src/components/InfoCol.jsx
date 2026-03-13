/** Label + value info cell used in forms and detail sections */
export default function InfoCol({ label, value, highlight, wide }) {
  const RED = "#cc1f1f";
  const GRAY_TEXT = "#757575";
  const GRAY_BG = "#f5f5f5";
  const RED_SOFT = "#fdecea";
  const BLACK = "#111111";
  return (
    <div className={wide ? "col-12" : "col-12 col-sm-6 col-lg-4"}>
      <div style={{
        background: highlight ? RED_SOFT : GRAY_BG,
        borderRadius: "8px",
        padding: "12px 14px",
        borderLeft: highlight ? `3px solid ${RED}` : "3px solid transparent",
      }}>
        <div style={{ fontSize: "10px", fontWeight: 700, color: GRAY_TEXT, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "4px" }}>{label}</div>
        <div style={{ fontSize: "14px", fontWeight: 600, color: highlight ? RED : BLACK }}>{value}</div>
      </div>
    </div>
  );
}
