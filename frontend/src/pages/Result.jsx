import { useState, useEffect, useMemo } from "react";
import Donut from "../components/Donut";
import axios from "axios";
import {
  FaTable, FaChartPie, FaLayerGroup, FaClipboardList, FaBullhorn,
  FaShieldAlt, FaChartBar, FaGraduationCap, FaPercent, FaBookOpen,
  FaMedal, FaIdCard, FaUniversity
} from "react-icons/fa";

/* ── Design tokens ── */
const C = {
  navy: "#0c2461", blue: "#1a3a7c", blue2: "#1d4ed8", blue3: "#3b82f6",
  red: "#b91c1c", red2: "#dc2626", green: "#16a34a",
  bg: "#eef3fc", card: "#fff", border: "#d1daf5",
  text: "#1e2d4e", muted: "#64748b",
};

const BAR_COLORS = ["#0c2461", "#1d4ed8", "#3b82f6", "#60a5fa", "#dc2626", "#b91c1c", "#ef4444"];

/* ── Helpers ── */
function gradeOf(p) {
  if (p >= 90) return { g: "A+", pts: 10, c: "#15803d", bg: "#f0fdf4" };
  if (p >= 80) return { g: "A", pts: 9, c: "#1d4ed8", bg: "#eff6ff" };
  if (p >= 70) return { g: "B", pts: 8, c: "#0c2461", bg: "#dbeafe" };
  if (p >= 60) return { g: "C", pts: 7, c: "#b45309", bg: "#fffbeb" };
  return { g: "F", pts: 0, c: "#dc2626", bg: "#fee2e2" };
}
const bclr = (p) => p >= 80 ? C.blue2 : p >= 60 ? C.blue3 : p >= 50 ? C.red : C.red2;
const catBg = (cat) => cat === "Core" ? "#dbeafe" : cat === "Lab" ? "#dcfce7" : "#ede9fe";
const catClr = (cat) => cat === "Core" ? "#1d4ed8" : cat === "Lab" ? "#16a34a" : "#7c3aed";



/* ── Reusable table inside a card ── */
function SemTable({ subjects, small }) {
  const crS = subjects.reduce((a, s) => a + s.cr, 0);
  const gpS = subjects.reduce((a, s) => a + gradeOf(s.int + s.ext).pts * s.cr, 0);
  return (
    <div style={{ borderRadius: 10, overflow: "hidden", border: `1px solid ${C.border}` }}>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: small ? "0.78rem" : "0.85rem" }}>
          <thead>
            <tr style={{ background: C.navy, color: "#fff" }}>
              {["#", "Subject", "Int", "Ext", "Total", "Grade", "Cr", "Pts", "Status"].map(h => (
                <th key={h} style={{ padding: "10px 10px", fontWeight: 700, whiteSpace: "nowrap", textAlign: h === "Subject" ? "left" : "center" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {subjects.map((s, i) => {
              const tot = s.int + s.ext;
              const gr = gradeOf(tot);
              const bc = bclr(tot);
              return (
                <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : "#f8faff", borderBottom: `1px solid ${C.border}` }}>
                  <td style={{ padding: "9px 10px", color: C.muted, textAlign: "center" }}>{i + 1}</td>
                  <td style={{ padding: "9px 10px" }}>
                    <div style={{ fontWeight: 700, color: C.text }}>{s.name}</div>
                    <div style={{ fontSize: "0.7rem", color: C.muted }}>{s.code}</div>
                    <span style={{ fontSize: "0.65rem", fontWeight: 700, padding: "2px 7px", borderRadius: 20, background: catBg(s.cat), color: catClr(s.cat) }}>{s.cat}</span>
                  </td>
                  <td style={{ padding: "9px 10px", textAlign: "center", fontWeight: 600 }}>{s.int}</td>
                  <td style={{ padding: "9px 10px", textAlign: "center", fontWeight: 600 }}>{s.ext}</td>
                  <td style={{ padding: "9px 10px", textAlign: "center", fontWeight: 800, color: bc }}>{tot}</td>
                  <td style={{ padding: "9px 10px", textAlign: "center" }}>
                    <span style={{ display: "inline-block", padding: "3px 10px", borderRadius: 20, fontWeight: 800, fontSize: "0.75rem", background: gr.bg, color: gr.c, border: `1px solid ${gr.c}` }}>{gr.g}</span>
                  </td>
                  <td style={{ padding: "9px 10px", textAlign: "center", fontWeight: 600 }}>{s.cr}</td>
                  <td style={{ padding: "9px 10px", textAlign: "center", fontWeight: 700, color: C.blue2 }}>{(gr.pts * s.cr).toFixed(1)}</td>
                  <td style={{ padding: "9px 10px", textAlign: "center" }}>
                    <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: "0.72rem", fontWeight: 700, background: gr.g === "F" ? "#fee2e2" : "#dcfce7", color: gr.g === "F" ? C.red2 : C.green }}>{gr.g === "F" ? "Fail" : "Pass"}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr style={{ background: "#f0f4ff", fontWeight: 700 }}>
              <td colSpan={6} style={{ padding: "10px", textAlign: "right", color: C.muted, fontSize: "0.8rem" }}>Semester Totals →</td>
              <td style={{ padding: "10px", textAlign: "center", color: C.blue2 }}>{crS}</td>
              <td style={{ padding: "10px", textAlign: "center", color: C.blue2 }}>{gpS.toFixed(1)}</td>
              <td style={{ padding: "10px", textAlign: "center" }}>
                <span style={{ background: "#dcfce7", color: C.green, padding: "3px 10px", borderRadius: 20, fontSize: "0.72rem", fontWeight: 700 }}>PASS ✓</span>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

/* ── Panel wrapper ── */
function Panel({ children, style }) {
  return (
    <div style={{ background: C.card, borderRadius: 14, boxShadow: "0 2px 14px rgba(12,36,97,0.08)", border: `1px solid ${C.border}`, overflow: "hidden", ...style }}>
      {children}
    </div>
  );
}

function PanelHeader({ icon, title, right }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", borderBottom: `1px solid ${C.border}`, background: "#f8faff" }}>
      <span style={{ fontWeight: 800, fontSize: "0.9rem", color: C.text, display: "flex", alignItems: "center", gap: "8px" }}>
        <span style={{ color: C.blue2 }}>{icon}</span>{title}
      </span>
      {right && <span style={{ fontSize: "0.75rem", color: C.blue3, fontWeight: 700 }}>{right}</span>}
    </div>
  );
}

/* ── MAIN COMPONENT ── */
export default function ResultPage() {
  const [activeSem, setActiveSem] = useState(3);
  const [barsOn, setBarsOn] = useState(false);

  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const liveStudent = user && user.student ? user.student : null;
  const studentName = liveStudent ? liveStudent.name : "Student";
  const studentRoll = liveStudent ? `21CS0${String(liveStudent.id).padStart(2, '0')}` : "2221CS0042";
  const studentGrade = liveStudent ? `Grade ${liveStudent.grade}` : "B.Tech – Computer Science";

  const [loading, setLoading] = useState(true);
  const [academicData, setAcademicData] = useState(null);

  useEffect(() => {
    const t = setTimeout(() => setBarsOn(true), 600);

    if (liveStudent) {
      const token = localStorage.getItem("token");
      axios.get("http://localhost:5002/api/academics/me", {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => {
        setAcademicData(res.data);
        setLoading(false);
      }).catch(err => {
        console.error("Academics API error:", err);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }

    return () => clearTimeout(t);
  }, [liveStudent]);

  const EXAMS = academicData?.exams || [];
  const NOTICES = academicData?.notices || [];
  const SEM_ALL = academicData?.semesterHistory || [];
  const SUBJECTS = useMemo(() => academicData?.currentSubjects || [], [academicData]);

  const { totCr, totGP } = useMemo(() => {
    const credits = SUBJECTS.reduce((a, s) => a + s.cr, 0);
    const gradePoints = SUBJECTS.reduce((a, s) => a + gradeOf(s.int + s.ext).pts * s.cr, 0);
    return { totCr: credits, totGP: gradePoints };
  }, [SUBJECTS]);

  const sgpa = totCr ? (totGP / totCr).toFixed(2) : "0.00";

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!user || user.type !== "parent") {
    return (
      <div className="container mt-5 text-center">
        <div className="alert alert-danger p-4 rounded-4 shadow-sm">
          <h5 className="mb-0">Please login as a parent to view academics.</h5>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: C.bg, minHeight: "100vh", padding: "24px 16px", fontFamily: "'Segoe UI', sans-serif", color: C.text }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>

        {/* ── PAGE TITLE ── */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <div style={{ width: 5, height: 34, borderRadius: 3, background: `linear-gradient(180deg, ${C.red} 0%, ${C.blue2} 100%)` }} />
          <h2 style={{ margin: 0, fontWeight: 900, fontSize: "1.6rem", color: C.navy }}>Academic Result</h2>
        </div>

        {/* ── BANNER ── */}
        <div style={{ background: `linear-gradient(125deg, ${C.navy} 0%, ${C.blue} 50%, ${C.blue2} 100%)`, borderRadius: 16, padding: "28px 32px", marginBottom: 24, boxShadow: "0 8px 28px rgba(12,36,97,.28)", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", right: -50, top: -50, width: 220, height: 220, borderRadius: "50%", background: "rgba(220,38,38,.12)", pointerEvents: "none" }} />
          <div style={{ display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap", position: "relative" }}>
            <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="student"
              style={{ width: 80, height: 80, borderRadius: "50%", border: "3px solid rgba(255,255,255,.5)", boxShadow: "0 0 0 4px rgba(220,38,38,.3)", backgroundColor: "#e8eaf6", flexShrink: 0 }} />

            <div style={{ flex: 1, minWidth: 180 }}>
              <div style={{ color: "rgba(255,255,255,.55)", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 6 }}>Parent View · Student Profile</div>
              <h3 style={{ color: "#fff", fontWeight: 900, fontSize: "1.3rem", margin: "0 0 10px" }}>{studentName}</h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                {[
                  { icon: <FaIdCard />, t: `Roll: ${studentRoll}` },
                  { icon: <FaGraduationCap />, t: studentGrade },
                  { icon: <FaLayerGroup />, t: "Semester IV · 2025–26" },
                  { icon: <FaUniversity />, t: "Sri Venkateswara College" },
                ].map((m, i) => (
                  <span key={i} style={{ color: "rgba(255,255,255,.7)", fontSize: "0.78rem", display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ color: "rgba(255,255,255,.75)" }}>{m.icon}</span>{m.t}
                  </span>
                ))}
              </div>
            </div>

            {/* Quick chips */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {[
                { v: sgpa, l: "SGPA", c: "#fff" },
                { v: "87%", l: "Overall", c: "#fff" },
                { v: "#12", l: "Rank", c: "#fde68a" },
                { v: "PASS", l: "Result", c: "#86efac" },
              ].map((ch, i) => (
                <div key={i} style={{ borderRadius: 10, padding: "12px 16px", textAlign: "center", minWidth: 78, background: "rgba(255,255,255,.13)", border: "1px solid rgba(255,255,255,.22)" }}>
                  <div style={{ fontWeight: 900, fontSize: "1.15rem", color: ch.c, lineHeight: 1 }}>{ch.v}</div>
                  <div style={{ fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", color: "rgba(255,255,255,.55)", marginTop: 4 }}>{ch.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── STAT CARDS ── */}
        <div className="row g-3 mb-4">
          {[
            { lbl: "Current SGPA", val: sgpa, sub: "Semester IV · 2025–26", grad: `linear-gradient(135deg,${C.navy},${C.blue2})`, icon: <FaGraduationCap /> },
            { lbl: "Overall Percentage", val: "87.4%", sub: "Distinction Category", grad: `linear-gradient(135deg,${C.blue},${C.blue3})`, icon: <FaPercent /> },
            { lbl: "Subjects Cleared", val: "7 / 7", sub: "No backlogs pending", grad: `linear-gradient(135deg,${C.red},${C.red2})`, icon: <FaBookOpen /> },
            { lbl: "Class Rank", val: "#12", sub: "Out of 120 students", grad: `linear-gradient(135deg,#7f1d1d,${C.red2})`, icon: <FaMedal /> },
          ].map((c, i) => (
            <div key={i} className="col-6 col-xl-3">
              <div style={{ background: c.grad, borderRadius: 14, padding: "20px 18px", color: "#fff", position: "relative", overflow: "hidden", boxShadow: "0 4px 16px rgba(12,36,97,.18)", height: "100%" }}>
                <div style={{ position: "absolute", right: -10, top: -10, fontSize: 52, opacity: 0.1 }}>{c.icon}</div>
                <div style={{ fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.8px", opacity: 0.75, marginBottom: 8 }}>{c.lbl}</div>
                <div style={{ fontSize: "1.8rem", fontWeight: 900, lineHeight: 1, marginBottom: 4 }}>{c.val}</div>
                <div style={{ fontSize: "0.73rem", opacity: 0.7 }}>{c.sub}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── SUBJECT RESULTS TABLE ── */}
        <Panel style={{ marginBottom: 24 }}>
          <PanelHeader icon={<FaTable />} title="Semester IV — Subject-wise Result" right="B.Tech · CS · Sem IV" />
          <div style={{ padding: 20 }}>
            <SemTable subjects={SUBJECTS} />
            {/* Summary bar */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 20, marginTop: 14, padding: "12px 16px", background: "#f0f4ff", borderRadius: 10, fontSize: "0.82rem" }}>
              {[
                { l: "Total Credits", v: totCr, c: C.blue2 },
                { l: "Grade Points", v: totGP.toFixed(1), c: C.blue2 },
                { l: "SGPA", v: sgpa, c: C.red2 },
                { l: "CGPA", v: "8.61", c: C.red2 },
              ].map((x, i) => (
                <span key={i} style={{ color: C.muted }}>{x.l}: <b style={{ color: x.c }}>{x.v}</b></span>
              ))}
            </div>
          </div>
        </Panel>

        {/* ── ANALYTICS + SEM TABS ── */}
        <div className="row g-3 mb-4">

          {/* Left – Performance Analytics */}
          <div className="col-12 col-lg-5">
            <Panel style={{ height: "100%" }}>
              <PanelHeader icon={<FaChartPie />} title="Performance Analytics" right="Sem IV · 2025–26" />
              <div style={{ padding: 20 }}>
                {/* Donut + KPIs */}
                <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
                  <Donut val={parseFloat(sgpa)} />
                  <div style={{ flex: 1 }}>
                    {[
                      { l: "CGPA (Overall)", v: "8.61", c: C.blue },
                      { l: "Class Average", v: "7.42", c: C.muted },
                      { l: "Highest Score", v: "9.80", c: C.red2 },
                      { l: "Backlogs", v: "None", c: C.green },
                      { l: "Attempt", v: "1st", c: C.blue2 },
                    ].map((r, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: i < 4 ? `1px solid ${C.border}` : "none" }}>
                        <span style={{ fontSize: "0.74rem", color: C.muted }}>{r.l}</span>
                        <span style={{ fontSize: "0.8rem", fontWeight: 800, color: r.c }}>{r.v}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Subject score bars */}
                <div style={{ fontWeight: 700, fontSize: "0.82rem", color: C.text, marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
                  <FaChartBar style={{ color: C.blue2 }} />Subject Scores
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
                  {SUBJECTS.map((s, i) => {
                    const tot = s.int + s.ext;
                    const cIdx = i % BAR_COLORS.length;
                    return (
                      <div key={i} style={{ display: "grid", gridTemplateColumns: "100px 1fr 34px", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: "0.72rem", color: C.muted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.name.split(" ").slice(0, 2).join(" ")}</span>
                        <div style={{ background: C.border, borderRadius: 20, height: 7, overflow: "hidden" }}>
                          <div style={{ width: barsOn ? `${tot}%` : "0%", height: "100%", borderRadius: 20, background: BAR_COLORS[cIdx], transition: "width 0.8s ease" }} />
                        </div>
                        <span style={{ fontSize: "0.7rem", fontWeight: 800, textAlign: "right", color: BAR_COLORS[cIdx] }}>{tot}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Rank blocks */}
                <div style={{ display: "flex", gap: 8 }}>
                  {[
                    { lbl: "Class Rank", v: "#12", clr: "#fde68a" },
                    { lbl: "Dept Rank", v: "#47", clr: "rgba(255,255,255,.75)" },
                    { lbl: "College", v: "#214", clr: "#93c5fd" },
                  ].map((r, i) => (
                    <div key={i} style={{ flex: 1, background: `linear-gradient(135deg,${C.navy},${C.blue})`, borderRadius: 10, padding: "12px 10px", textAlign: "center" }}>
                      <div style={{ fontWeight: 900, fontSize: "1.5rem", color: r.clr, lineHeight: 1 }}>{r.v}</div>
                      <div style={{ color: "rgba(255,255,255,.5)", fontSize: "0.6rem", marginTop: 4 }}>{r.lbl}</div>
                    </div>
                  ))}
                </div>
              </div>
            </Panel>
          </div>

          {/* Right – Semester-wise */}
          <div className="col-12 col-lg-7">
            <Panel style={{ height: "100%" }}>
              <PanelHeader icon={<FaLayerGroup />} title="Semester-wise Marks" right="All Semesters · B.Tech CS" />
              <div style={{ padding: 20 }}>
                {/* Sem selector */}
                <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
                  {SEM_ALL.map((sem, i) => (
                    <div key={i} onClick={() => setActiveSem(i)}
                      style={{
                        flex: 1, minWidth: 70, padding: "10px 8px", borderRadius: 10, textAlign: "center", cursor: "pointer",
                        background: activeSem === i ? C.navy : "#f0f4ff",
                        border: `1px solid ${activeSem === i ? C.navy : C.border}`,
                        transition: "all 0.2s"
                      }}>
                      <div style={{ fontSize: "0.7rem", fontWeight: 700, color: activeSem === i ? "rgba(255,255,255,.75)" : C.muted }}>{sem.sem}</div>
                      <div style={{ fontWeight: 900, fontSize: "1rem", color: activeSem === i ? "#fff" : C.navy }}>{sem.sgpa}</div>
                      <div style={{ fontSize: "0.6rem", color: activeSem === i ? "rgba(255,255,255,.5)" : C.muted }}>{sem.subjects.length} subj.</div>
                    </div>
                  ))}
                </div>
                {/* Active sem table */}
                {SEM_ALL[activeSem] && (
                  <>
                    <SemTable subjects={SEM_ALL[activeSem].subjects} small />
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginTop: 10, fontSize: "0.78rem" }}>
                      {(() => {
                        const ss = SEM_ALL[activeSem].subjects;
                        const cr = ss.reduce((a, s) => a + s.cr, 0);
                        const gp = ss.reduce((a, s) => a + gradeOf(s.int + s.ext).pts * s.cr, 0);
                        return [
                          { l: "Credits", v: cr },
                          { l: "Grade Points", v: gp.toFixed(1) },
                          { l: "SGPA", v: (gp / cr).toFixed(2) },
                          { l: "Result", v: "PASS" },
                        ].map((x, i) => (
                          <span key={i} style={{ color: C.muted }}>{x.l}: <b style={{ color: C.blue2 }}>{x.v}</b></span>
                        ));
                      })()}
                    </div>
                  </>
                )}
              </div>
            </Panel>
          </div>
        </div>

        {/* ── RECENT EXAMS + NOTICES ── */}
        <div className="row g-3 mb-4">
          <div className="col-12 col-md-6">
            <Panel style={{ height: "100%" }}>
              <PanelHeader icon={<FaClipboardList />} title="Recent Exams" right="View All" />
              <div style={{ padding: "8px 20px 16px" }}>
                {EXAMS.map((e, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: i < EXAMS.length - 1 ? `1px solid ${C.border}` : "none" }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: e.clr + "18", color: e.clr, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontWeight: 800, fontSize: "0.85rem" }}>
                      {e.sc}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: "0.83rem", color: C.text }}>{e.n}</div>
                      <div style={{ fontSize: "0.7rem", color: C.muted, marginTop: 2 }}>{e.sub} · {e.date}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontWeight: 900, fontSize: "1rem", color: e.clr }}>{e.sc}</div>
                      <div style={{ fontSize: "0.65rem", color: C.muted }}>/ {e.max}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Panel>
          </div>

          <div className="col-12 col-md-6">
            <Panel style={{ height: "100%" }}>
              <PanelHeader icon={<FaBullhorn />} title="Notices" />
              <div style={{ padding: "8px 20px 16px" }}>
                {NOTICES.map((n, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "12px 0", borderBottom: i < NOTICES.length - 1 ? `1px solid ${C.border}` : "none" }}>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: n.dot, flexShrink: 0, marginTop: 5 }} />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: "0.82rem", color: C.text }}>{n.t}</div>
                      <div style={{ fontSize: "0.72rem", color: C.muted, marginTop: 2 }}>{n.p}</div>
                      <div style={{ fontSize: "0.67rem", color: C.blue2, fontWeight: 700, marginTop: 3 }}>{n.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Panel>
          </div>
        </div>

        {/* ── FOOTER ── */}
        <div style={{ textAlign: "center", color: C.muted, fontSize: "0.82rem", padding: "12px 0 4px", borderTop: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <FaShieldAlt style={{ color: C.blue2 }} />
          This result is digitally verified by Sri Venkateswara College · Academic Year 2025–26 · Confidential – For Parent/Guardian Use Only
        </div>

      </div>
    </div>
  );
}
