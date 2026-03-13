import { useState, useMemo, useEffect } from "react";
// Make sure Bootstrap CSS is imported in your project's main entry file:
// import 'bootstrap/dist/css/bootstrap.min.css';

import axios from "axios";
import {
  FaCalendarAlt, FaCalendar, FaBook, FaCheckCircle, FaTimesCircle,
  FaExclamationTriangle
} from "react-icons/fa";

/* ─── CONSTANTS ─── */
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const CAL_STYLE = {
  present: { bg: "#eff6ff", border: "#3b82f6", color: "#1d4ed8", label: "P" },
  absent: { bg: "#fff1f2", border: "#ef4444", color: "#dc2626", label: "A" },
  weekend: { bg: "#f1f5f9", border: "#cbd5e1", color: "#94a3b8", label: "—" },
};

/* ─── HELPERS ─── */
const getBarColor = (p) => p >= 90 ? "#0d3b8c" : p >= 75 ? "#d97706" : "#b91c1c";
const getColor = (p) => p >= 90 ? "#0d3b8c" : p >= 75 ? "#d97706" : "#dc2626";
const getGradient = (p) => p >= 90 ? "#0d3b8c" : p >= 75 ? "#d97706" : "#b91c1c";
const getBadge = (p) => p >= 90 ? { label: "Excellent", bg: "#eff6ff", color: "#1d4ed8" } : p >= 75 ? { label: "Average", bg: "#fef3c7", color: "#b45309" } : { label: "Low", bg: "#fff1f2", color: "#dc2626" };

function buildCalendar(year, month, attendanceMap) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    const dow = new Date(year, month, d).getDay();
    const isWeekend = dow === 0 || dow === 6;
    const key = `${year}-${month + 1}-${d}`;
    const status = isWeekend ? "weekend" : (attendanceMap[key] || "present");
    cells.push({ day: d, status });
  }
  return cells;
}

function getMonthSummary(year, month, attendanceMap) {
  const cells = buildCalendar(year, month, attendanceMap).filter(Boolean);
  let present = 0, absent = 0;
  cells.forEach((c) => {
    if (c.status === "present") present++;
    else if (c.status === "absent") absent++;
  });
  return { present, absent };
}

/* ─── SUB-COMPONENTS ─── */

function MonthlyTab({ monthlyData = [] }) {
  return (
    <div>
      {/* Header + Donut */}
      <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-4">
        <div>
          <div style={{ color: "#06225a", fontWeight: 800, fontSize: 16 }}>Monthly Overview</div>
          <div style={{ color: "#64748b", fontSize: 13, marginTop: 3 }}>Attendance trend across months</div>
        </div>
        <div style={{ position: "relative", width: 100, height: 100 }}>
          <svg width="100" height="100" viewBox="0 0 110 110" style={{ transform: "rotate(-90deg)" }}>
            <circle cx="55" cy="55" r="44" fill="none" stroke="#e8ecf8" strokeWidth="13" />
            <circle cx="55" cy="55" r="44" fill="none" stroke="#0d3b8c" strokeWidth="13"
              strokeDasharray={`${0.89 * 276.5} ${276.5}`} strokeLinecap="round" />
            <circle cx="55" cy="55" r="44" fill="none" stroke="#dc2626" strokeWidth="13"
              strokeDasharray={`${0.075 * 276.5} ${276.5}`}
              strokeDashoffset={`-${0.89 * 276.5}`} strokeLinecap="round" />
          </svg>
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", textAlign: "center" }}>
            <div style={{ fontSize: 18, fontWeight: 900, color: "#0d3b8c" }}>89%</div>
            <div style={{ fontSize: 9, color: "#94a3b8" }}>Overall</div>
          </div>
        </div>
      </div>

      {/* Bar Chart */}
      <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 150, borderBottom: "2px solid #e8ecf8", paddingBottom: 8, marginBottom: 8 }}>
        {monthlyData.map((m) => (
          <div key={m.month} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, height: "100%", justifyContent: "flex-end" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#475569" }}>{m.pct}%</div>
            <div style={{ width: "100%", borderRadius: "5px 5px 0 0", background: getBarColor(m.pct), height: `${m.pct}%`, minHeight: 10 }} />
          </div>
        ))}
      </div>
      <div className="d-flex mb-4">
        {monthlyData.map((m) => (
          <div key={m.month} style={{ flex: 1, textAlign: "center", fontSize: 12, color: "#64748b", fontWeight: 600 }}>{m.month}</div>
        ))}
      </div>

      {/* Table */}
      <div style={{ border: "1px solid #e8ecf8", borderRadius: 10, overflow: "hidden" }}>
        <table className="table table-sm mb-0" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#0d3b8c" }}>
              {["Month", "Present", "Total Days", "Attendance %", "Status"].map((h) => (
                <th key={h} style={{ padding: "10px 14px", color: "white", fontSize: 12, fontWeight: 700, border: "none" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {monthlyData.map((m, i) => {
              const badge = getBadge(m.pct);
              return (
                <tr key={m.month} style={{ background: i % 2 === 0 ? "white" : "#f8faff", borderBottom: "1px solid #eef2fb" }}>
                  <td style={{ padding: "10px 14px", fontWeight: 600, color: "#06225a", fontSize: 13, border: "none" }}>{m.month} 2024</td>
                  <td style={{ padding: "10px 14px", color: "#1d4ed8", fontWeight: 700, fontSize: 13, border: "none" }}>{m.present}</td>
                  <td style={{ padding: "10px 14px", color: "#475569", fontSize: 13, border: "none" }}>{m.total}</td>
                  <td style={{ padding: "10px 14px", fontWeight: 800, color: getColor(m.pct), fontSize: 13, border: "none" }}>{m.pct}%</td>
                  <td style={{ padding: "10px 14px", border: "none" }}>
                    <span style={{ background: badge.bg, color: badge.color, padding: "3px 10px", borderRadius: 12, fontSize: 11, fontWeight: 700 }}>{badge.label}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="d-flex gap-3 flex-wrap mt-3">
        {[["#0d3b8c", "≥90% Excellent"], ["#d97706", "75–89% Average"], ["#dc2626", "<75% Critical"]].map(([c, l]) => (
          <div key={l} className="d-flex align-items-center gap-2" style={{ fontSize: 12, color: "#64748b" }}>
            <div style={{ width: 13, height: 13, borderRadius: 3, background: c }} />{l}
          </div>
        ))}
      </div>
    </div>
  );
}

function CalendarTab({ attendanceMap = {} }) {
  const today = new Date();
  const [year, setYear] = useState(2024);
  const [month, setMonth] = useState(10); // 0-indexed: 10 = November

  const cells = useMemo(() => buildCalendar(year, month, attendanceMap), [year, month, attendanceMap]);
  const summary = useMemo(() => getMonthSummary(year, month, attendanceMap), [year, month, attendanceMap]);
  const todayY = today.getFullYear();
  const todayM = today.getMonth();
  const todayD = today.getDate();
  const todayKey = `${todayY}-${todayM + 1}-${todayD}`;
  const isCurrentMonth = year === todayY && month === todayM;

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear((y) => y - 1); }
    else setMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (isCurrentMonth) return;
    if (month === 11) { setMonth(0); setYear((y) => y + 1); }
    else setMonth((m) => m + 1);
  };

  return (
    <div>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
        <div>
          <div style={{ color: "#06225a", fontWeight: 800, fontSize: 16, display: "flex", alignItems: "center", gap: 8 }}><FaCalendar /> {MONTHS[month]} {year}</div>
          <div style={{ color: "#64748b", fontSize: 13, marginTop: 3 }}>Day-by-day attendance record</div>
        </div>
        <div className="d-flex align-items-center gap-2">
          <button onClick={prevMonth} style={{ width: 36, height: 36, borderRadius: 8, border: "1.5px solid #dde4f5", background: "white", color: "#0d3b8c", fontSize: 16, cursor: "pointer", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>‹</button>
          <div style={{ minWidth: 140, textAlign: "center", fontWeight: 700, fontSize: 14, color: "#06225a", background: "#eef2fb", borderRadius: 8, padding: "7px 16px" }}>
            {MONTHS[month].slice(0, 3)} {year}
          </div>
          <button
            onClick={nextMonth}
            disabled={isCurrentMonth}
            style={{
              width: 36, height: 36, borderRadius: 8,
              border: isCurrentMonth ? "1.5px solid #e2e8f0" : "1.5px solid #dde4f5",
              background: isCurrentMonth ? "#f1f5f9" : "white",
              color: isCurrentMonth ? "#cbd5e1" : "#0d3b8c",
              fontSize: 16,
              cursor: isCurrentMonth ? "not-allowed" : "pointer",
              fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center",
              opacity: isCurrentMonth ? 0.45 : 1,
            }}>›</button>
        </div>
      </div>

      {/* Day headers */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 4, marginBottom: 4 }}>
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} style={{ textAlign: "center", fontWeight: 700, color: "#94a3b8", fontSize: 11, padding: "8px 0", background: "#f8faff", borderRadius: 6 }}>{d}</div>
        ))}
      </div>

      {/* Calendar grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 4, marginBottom: 16 }}>
        {cells.map((cell, i) => {
          if (!cell) return <div key={`e${i}`} style={{ minHeight: 52 }} />;
          const cs = CAL_STYLE[cell.status];
          const key = `${year}-${month + 1}-${cell.day}`;
          const isToday = key === todayKey;
          const isFuture = isCurrentMonth && cell.day > todayD;
          const displayCs = isFuture ? { bg: "#f8faff", border: "#e2e8f0", color: "#cbd5e1", label: "—" } : cs;
          return (
            <div key={cell.day} style={{
              background: displayCs.bg,
              border: isToday ? "2.5px solid #0d3b8c" : `1.5px solid ${displayCs.border}`,
              borderRadius: 10, padding: "8px 4px", textAlign: "center", minHeight: 52,
              position: "relative",
              boxShadow: isToday ? "0 0 0 3px rgba(13,59,140,0.15)" : "none",
              opacity: isFuture ? 0.4 : 1,
              cursor: "default",
            }}>
              {isToday && (
                <div style={{ position: "absolute", top: 3, right: 5, width: 6, height: 6, borderRadius: "50%", background: "#0d3b8c" }} />
              )}
              <div style={{ fontSize: 14, fontWeight: 800, color: displayCs.color, lineHeight: 1 }}>{cell.day}</div>
              <div style={{
                fontSize: 9, marginTop: 4, fontWeight: 700,
                background: isFuture ? "transparent" : cell.status === "present" ? "#dbeafe" : cell.status === "absent" ? "#fee2e2" : "transparent",
                color: displayCs.color,
                borderRadius: 4, padding: "1px 4px", display: "inline-block",
              }}>
                {displayCs.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="d-flex gap-3 flex-wrap mb-4">
        {[
          { bg: "#eff6ff", border: "#3b82f6", color: "#1d4ed8", label: "Present" },
          { bg: "#fff1f2", border: "#ef4444", color: "#dc2626", label: "Absent" },
          { bg: "#f1f5f9", border: "#cbd5e1", color: "#94a3b8", label: "Weekend" },
        ].map((l) => (
          <div key={l.label} className="d-flex align-items-center gap-2" style={{ fontSize: 12 }}>
            <div style={{ width: 14, height: 14, borderRadius: 3, background: l.bg, border: `1.5px solid ${l.border}` }} />
            <span style={{ color: l.color, fontWeight: 600 }}>{l.label}</span>
          </div>
        ))}
      </div>

      {/* Monthly summary cards */}
      <div className="row g-3">
        {[
          { label: "Present Days", val: summary.present, color: "#1d4ed8", bg: "#eff6ff", icon: <FaCheckCircle /> },
          { label: "Absent Days", val: summary.absent, color: "#dc2626", bg: "#fff1f2", icon: <FaTimesCircle /> },
        ].map((s) => (
          <div className="col-6" key={s.label}>
            <div style={{ background: s.bg, borderRadius: 12, padding: 16, textAlign: "center", border: `1.5px solid ${s.color}22` }}>
              <div style={{ fontSize: 22, marginBottom: 4, color: s.color }}>{s.icon}</div>
              <div style={{ fontSize: 30, fontWeight: 900, color: s.color, lineHeight: 1 }}>{s.val}</div>
              <div style={{ fontSize: 12, color: s.color, fontWeight: 600, marginTop: 4 }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SubjectsTab({ subjects = [] }) {
  return (
    <div>
      <div style={{ color: "#06225a", fontWeight: 800, fontSize: 16, marginBottom: 4 }}>Subject-wise Attendance</div>
      <div style={{ color: "#64748b", fontSize: 13, marginBottom: 20 }}>Breakdown per subject this year</div>

      {subjects.map((s) => {
        const badge = getBadge(s.pct);
        return (
          <div key={s.name} style={{ background: "#f8faff", borderRadius: 10, padding: "14px 18px", border: "1px solid #e8ecf8", marginBottom: 12 }}>
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-2">
              <div style={{ fontWeight: 700, color: "#06225a", fontSize: 14 }}>{s.name}</div>
              <div className="d-flex align-items-center gap-3">
                <span style={{ fontSize: 13, color: "#64748b" }}>{s.present}/{s.total} days</span>
                <span style={{ fontWeight: 900, color: getColor(s.pct), fontSize: 16 }}>{s.pct}%</span>
                <span style={{ background: badge.bg, color: badge.color, padding: "3px 11px", borderRadius: 12, fontSize: 11, fontWeight: 700 }}>{badge.label}</span>
              </div>
            </div>
            <div style={{ background: "#e8ecf8", borderRadius: 20, height: 10, overflow: "hidden" }}>
              <div style={{ width: `${s.pct}%`, height: "100%", borderRadius: 20, background: getGradient(s.pct), transition: "width 0.7s ease" }} />
            </div>
          </div>
        );
      })}

      {/* Alert */}
      <div style={{ background: "#fff1f2", border: "1.5px solid #fca5a5", borderRadius: 10, padding: "14px 18px", marginTop: 8, display: "flex", gap: 12, alignItems: "flex-start" }}>
        <FaExclamationTriangle style={{ fontSize: 22, color: "#dc2626", flexShrink: 0, marginTop: 2 }} />
        <div>
          <div style={{ fontWeight: 800, color: "#b91c1c", fontSize: 14 }}>Attendance Alert</div>
          <div style={{ color: "#7f1d1d", fontSize: 13, marginTop: 3 }}>
            <strong>Physical Education</strong> is at 70% — below the 75% minimum requirement. Please ensure regular attendance to avoid penalties.
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── MAIN COMPONENT ─── */
export default function AttendancePage() {
  const [tab, setTab] = useState("monthly");

  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const student = user?.student;
  const rollNo = student ? `21CS0${String(student.id).padStart(2, '0')}` : "";

  const [attendanceData, setAttendanceData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!student) {
      setLoading(false);
      return;
    }

    const token = localStorage.getItem("token");
    axios.get("http://localhost:5002/api/attendance/me", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setAttendanceData(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Attendance API error:", err);
        setLoading(false);
      });
  }, [student]);

  // Safe fallbacks for hooks
  const safeData = attendanceData || {};
  const summaryStats = safeData.summaryStats || [];
  const monthlyData = safeData.monthlyData || [];
  const attendanceMap = safeData.attendanceMap || {};
  const subjects = safeData.subjects || [];

  const tabs = [
    { id: "monthly", label: "Monthly Overview", icon: <FaCalendarAlt /> },
    { id: "calendar", label: "Calendar View", icon: <FaCalendar /> },
    { id: "subjects", label: "Subject-wise", icon: <FaBook /> },
  ];

  if (!user || user.type !== 'parent') {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger text-center p-4 rounded-4 shadow-sm">
          <h5 className="mb-0">Please login as a parent to view this page.</h5>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "28px 20px", minHeight: "100vh", background: "#eef2fb" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>

        {/* Page Header */}
        <div className="mb-4">
          <h4 style={{ color: "#06225a", fontWeight: 800, fontSize: 22, margin: 0 }}>Attendance Report</h4>
          <p style={{ color: "#64748b", fontSize: 13, margin: "4px 0 0" }}>
            {student.name} &nbsp;|&nbsp; Grade {student.grade} &nbsp;|&nbsp; Roll No: {rollNo} &nbsp;|&nbsp;
            <span style={{ color: "#dc2626", fontWeight: 600 }}>Academic Year 2024–25</span>
          </p>
        </div>

        {/* Stat Cards */}
        <div className="row g-3 mb-4">
          {summaryStats.map((s, i) => (
            <div className="col-6 col-md-4" key={i}>
              <div style={{ background: s.bg, boxShadow: `0 4px 16px ${s.shadow}`, borderRadius: 12, padding: "20px 18px", color: "white", position: "relative", overflow: "hidden", height: "100%" }}>
                <div style={{ position: "absolute", right: -10, top: -10, fontSize: 58, opacity: 0.12 }}>{s.icon}</div>
                <div style={{ fontSize: 11, opacity: 0.85, textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 8 }}>{s.label}</div>
                <div style={{ fontSize: 34, fontWeight: 900, lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 11, opacity: 0.75, marginTop: 6 }}>{s.sub}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Tab Buttons */}
        <div className="d-flex gap-2 flex-wrap mb-3">
          {tabs.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              padding: "9px 20px", borderRadius: 8, fontSize: 13, cursor: "pointer",
              border: tab === t.id ? "none" : "1.5px solid #dde4f5",
              background: tab === t.id ? "#0d3b8c" : "white",
              color: tab === t.id ? "white" : "#555",
              fontWeight: tab === t.id ? 700 : 400,
              boxShadow: tab === t.id ? "0 3px 10px rgba(13,59,140,0.25)" : "0 1px 4px rgba(0,0,0,0.06)",
              transition: "all 0.2s",
              display: "flex", alignItems: "center", gap: 6,
            }}>{t.icon} {t.label}</button>
          ))}
        </div>

        {/* Tab Content */}
        <div style={{ background: "white", borderRadius: 14, padding: 28, boxShadow: "0 2px 12px rgba(13,59,140,0.08)" }}>
          {tab === "monthly" && <MonthlyTab monthlyData={monthlyData} />}
          {tab === "calendar" && <CalendarTab attendanceMap={attendanceMap} />}
          {tab === "subjects" && <SubjectsTab subjects={subjects} />}
        </div>

      </div>
    </div>
  );
}
