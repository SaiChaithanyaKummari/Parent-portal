import { useState, useEffect } from "react";

/** Animated horizontal progress bar */
export default function PBar({ pct, color = "#1d4ed8" }) {
  const [w, setW] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setW(pct), 350);
    return () => clearTimeout(t);
  }, [pct]);
  return (
    <div style={{ background: "#dbeafe", borderRadius: "20px", height: "6px", width: "80px", overflow: "hidden" }}>
      <div style={{ width: `${w}%`, height: "100%", borderRadius: "20px", background: color, transition: "width 0.7s ease" }} />
    </div>
  );
}
