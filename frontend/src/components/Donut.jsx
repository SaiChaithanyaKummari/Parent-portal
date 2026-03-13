import { useState, useEffect } from "react";

/** Animated SVG SGPA donut chart */
export default function Donut({ val }) {
  const r = 44;
  const circ = 2 * Math.PI * r;
  const [off, setOff] = useState(circ);

  useEffect(() => {
    const t = setTimeout(() => setOff(circ - (val / 10) * circ * 0.87), 450);
    return () => clearTimeout(t);
  }, [val, circ]);

  return (
    <div style={{ position: "relative", width: 116, height: 116, flexShrink: 0 }}>
      <svg width={116} height={116} viewBox="0 0 116 116" style={{ transform: "rotate(-90deg)" }}>
        <circle cx={58} cy={58} r={r} fill="none" stroke="#dbeafe" strokeWidth={11} />
        <circle
          cx={58} cy={58} r={r} fill="none"
          stroke="#1d4ed8" strokeWidth={11}
          strokeDasharray={circ} strokeDashoffset={off}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1.4s cubic-bezier(.4,0,.2,1)" }}
        />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: "1.5rem", fontWeight: 900, color: "#1a3a7c", lineHeight: 1 }}>{val}</span>
        <span style={{ fontSize: "0.58rem", color: "#64748b", fontWeight: 700, marginTop: 3 }}>SGPA</span>
      </div>
    </div>
  );
}
