import React, { useMemo } from "react";
import InfoCol from "../components/InfoCol";
import QuickInfo from "../components/QuickInfo";
import {
  FaGraduationCap,
  FaIdCard,
  FaCalendarAlt,
  FaSchool,
  FaPhone,
  FaUserFriends,
  FaBirthdayCake,
  FaFolderOpen,
  FaUser,
  FaMapMarkerAlt,
  FaHome,
} from "react-icons/fa";

/* ─── CONSTANTS ─── */
const NAVY = "#1a237e";
const BLUE = "#3949ab";
const BLUE_SOFT = "#e8eaf6";
const RED = "#cc1f1f";
const RED_SOFT = "#fdecea";
const GRAY_BG = "#f5f5f5";
const GRAY_TEXT = "#757575";
const GRAY_BORDER = "#e0e0e0";
const BLACK = "#111111";


/* ─── MAIN COMPONENT ─── */

function StudentDetails() {
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const [liveStudent, setLiveStudent] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    if (!user || user.type !== 'parent') {
      setLoading(false);
      return;
    }
    
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No authentication token found. Please log in again.");
      setLoading(false);
      return;
    }

    fetch("http://localhost:5002/api/students/me", {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch student data");
        return res.json();
      })
      .then(data => {
        setLiveStudent(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [user]);

  const student = useMemo(() => {
    if (!liveStudent) return {};
    
    return {
      name: liveStudent.name || "",
      roll: `21CS0${String(liveStudent.id || "").padStart(2, '0')}`,
      program: liveStudent.program || "B.Tech",
      branch: liveStudent.branch || "Computer Science Engineering",
      batch: liveStudent.batch || "2022-2026",
      yearOfJoin: liveStudent.yearOfJoin || "2022",
      admissionDate: liveStudent.admissionDate || "12-08-2022",
      gender: liveStudent.gender || "Male",
      caste: liveStudent.caste || "OBC",
      dob: liveStudent.dob || "15-05-2004",
      studentPhone: liveStudent.studentPhone || "9876543210",
      parentPhone: liveStudent.parentPhone || "9123456780",
      address: {
        doorno: liveStudent.address?.doorno || "12-45",
        street: liveStudent.address?.street || (typeof liveStudent.address === "string" ? liveStudent.address : "Main Street"),
        village: liveStudent.address?.village || "Kompally",
        mandal: liveStudent.address?.mandal || "Medchal",
        district: liveStudent.address?.district || "Medchal-Malkajgiri",
        state: liveStudent.address?.state || "Telangana",
        pincode: liveStudent.address?.pincode || "500014",
      },
    };
  }, [liveStudent]);

  const statCards = useMemo(() => {
    if (!liveStudent) return [];
    return [
      { icon: <FaGraduationCap />, label: "Program", value: student.program, bg: BLUE_SOFT },
      { icon: <FaIdCard />, label: "Roll No", value: student.roll, bg: RED_SOFT },
      { icon: <FaCalendarAlt />, label: "Batch", value: student.batch, bg: BLUE_SOFT },
      { icon: <FaSchool />, label: "Grade", value: `Grade ${liveStudent.grade || ""}`, bg: "#f0f0f0" },
    ];
  }, [student, liveStudent]);

  const fatherName = user?.name || "";

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger text-center p-4 rounded-4 shadow-sm">
          <h5 className="mb-0">{error}</h5>
        </div>
      </div>
    );
  }

  if (!user || user.type !== 'parent') {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger text-center p-4 rounded-4 shadow-sm">
          <h5 className="mb-0">Please login as a parent to view this page.</h5>
        </div>
      </div>
    );
  }

  const fullAddress = `${student.address.doorno}, ${student.address.street}, ${student.address.village}, ${student.address.mandal}, ${student.address.district}, ${student.address.state} - ${student.address.pincode}`;

  const cardHeaderStyle = {
    background: NAVY,
    color: "#fff",
    fontSize: "14px",
    fontWeight: 700,
    padding: "14px 20px",
    border: "none",
    letterSpacing: "0.2px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  };

  return (
    <div style={{ backgroundColor: GRAY_BG, minHeight: "100vh", fontFamily: "'Segoe UI', sans-serif", color: BLACK }}>
      <div className="container-lg py-4 px-3 px-md-4">

        {/* Page Heading */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
          <div style={{ width: "5px", height: "34px", borderRadius: "3px", flexShrink: 0, background: BLUE }} />
          <h2 style={{ fontSize: "26px", fontWeight: 900, color: NAVY, letterSpacing: "-0.3px", margin: 0 }}>Student Overview</h2>
        </div>

        {/* Stat Cards */}
        <div className="row g-3 mb-4">
          {statCards.map((s) => (
            <div className="col-6 col-md-3" key={s.label}>
              <div style={{ background: "#fff", borderRadius: "12px", boxShadow: "0 2px 10px rgba(13,27,62,0.07)", overflow: "hidden" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "16px" }}>
                  <div style={{ width: "44px", height: "44px", borderRadius: "10px", background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", flexShrink: 0, color: NAVY }}>
                    {s.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: "10px", fontWeight: 700, color: GRAY_TEXT, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "2px" }}>{s.label}</div>
                    <div style={{ fontSize: "15px", fontWeight: 800, color: NAVY }}>{s.value}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Layout */}
        <div className="row g-4">

          {/* Profile Sidebar */}
          <div className="col-12 col-md-4 col-lg-3">
            <div style={{ background: NAVY, borderRadius: "16px", boxShadow: "0 4px 20px rgba(13,27,62,0.15)", height: "100%" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "28px 20px" }}>
                {/* Avatar */}
                <div style={{ position: "relative", display: "inline-block", marginBottom: "16px" }}>
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                    alt="student"
                    style={{ width: "100px", height: "100px", borderRadius: "50%", border: `4px solid ${RED}`, objectFit: "cover", backgroundColor: BLUE_SOFT, display: "block" }}
                  />
                  <span style={{ position: "absolute", bottom: "5px", right: "5px", width: "16px", height: "16px", background: "#22c55e", borderRadius: "50%", border: `3px solid ${NAVY}`, display: "block" }} />
                </div>

                <h4 style={{ fontSize: "20px", fontWeight: 900, color: "#fff", margin: "0 0 4px" }}>{student.name}</h4>
                <p style={{ fontSize: "12px", fontWeight: 700, color: "#8ea3c3", letterSpacing: "1.2px", textTransform: "uppercase", margin: "0 0 12px" }}>{student.roll}</p>

                {/* Badges */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", justifyContent: "center", marginBottom: "12px" }}>
                  <span style={{ background: BLUE, color: "#fff", fontSize: "11px", fontWeight: 700, padding: "4px 10px", borderRadius: "20px" }}>{student.program}</span>
                  <span style={{ background: "rgba(255,255,255,0.12)", color: "#c8d4ec", fontSize: "11px", fontWeight: 700, padding: "4px 10px", borderRadius: "20px" }}>{student.batch}</span>
                </div>
                <p style={{ fontSize: "12px", color: "#8ea3c3", fontWeight: 500, lineHeight: 1.5, margin: 0 }}>{student.branch}</p>

                <hr style={{ borderColor: "rgba(255,255,255,0.10)", width: "100%", margin: "20px 0" }} />

                <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "16px" }}>
                  <QuickInfo icon={<FaPhone />} label="Student Phone" value={student.studentPhone} />
                  <QuickInfo icon={<FaUserFriends />} label="Parent Contact" value={student.parentPhone} />
                  <QuickInfo icon={<FaBirthdayCake />} label="Date of Birth" value={student.dob} />
                  <QuickInfo icon={<FaFolderOpen />} label="Admitted On" value={student.admissionDate} />
                </div>
              </div>
            </div>
          </div>

          {/* Detail Sections */}
          <div className="col-12 col-md-8 col-lg-9" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

            {/* Personal Information */}
            <div style={{ borderRadius: "14px", boxShadow: "0 2px 12px rgba(13,27,62,0.07)", overflow: "hidden", background: "#fff" }}>
              <div style={cardHeaderStyle}><FaUser style={{ fontSize: "16px" }} /><span>Personal Information</span></div>
              <div className="p-3 p-md-4">
                <div className="row g-3">
                  <InfoCol label="Full Name" value={student.name} />
                  <InfoCol label="Father's Name" value={fatherName} />
                  <InfoCol label="Roll Number" value={student.roll} />
                  <InfoCol label="Program" value={student.program} />
                  <InfoCol label="Branch" value={student.branch} wide />
                  <InfoCol label="Batch" value={student.batch} />
                  <InfoCol label="Year of Join" value={student.yearOfJoin} />
                  <InfoCol label="Admission Date" value={student.admissionDate} />
                  <InfoCol label="Date of Birth" value={student.dob} />
                  <InfoCol label="Gender" value={student.gender} />
                  <InfoCol label="Caste Category" value={student.caste} highlight />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div style={{ borderRadius: "14px", boxShadow: "0 2px 12px rgba(13,27,62,0.07)", overflow: "hidden", background: "#fff" }}>
              <div style={cardHeaderStyle}><FaPhone style={{ fontSize: "16px" }} /><span>Contact Information</span></div>
              <div className="p-3 p-md-4">
                <div className="row g-3">
                  <InfoCol label="Student Phone" value={student.studentPhone} />
                  <InfoCol label="Parent Contact" value={student.parentPhone} />
                </div>
              </div>
            </div>

            {/* Residential Address */}
            <div style={{ borderRadius: "14px", boxShadow: "0 2px 12px rgba(13,27,62,0.07)", overflow: "hidden", background: "#fff" }}>
              <div style={cardHeaderStyle}><FaMapMarkerAlt style={{ fontSize: "16px" }} /><span>Residential Address</span></div>
              <div className="p-3 p-md-4">
                <div style={{ background: NAVY, color: "#c8d4ec", fontSize: "13px", fontWeight: 500, lineHeight: 1.6, padding: "12px 16px", borderRadius: "8px", borderLeft: `4px solid ${RED}`, marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
                  <FaHome style={{ flexShrink: 0 }} /> {fullAddress}
                </div>
                <div className="row g-3">
                  <InfoCol label="Door No" value={student.address.doorno} />
                  <InfoCol label="Street" value={student.address.street} />
                  <InfoCol label="Village" value={student.address.village} />
                  <InfoCol label="Mandal" value={student.address.mandal} />
                  <InfoCol label="District" value={student.address.district} />
                  <InfoCol label="State" value={student.address.state} />
                  <InfoCol label="Pincode" value={student.address.pincode} highlight />
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div style={{ textAlign: "center", color: GRAY_TEXT, borderTop: `1px solid ${GRAY_BORDER}`, marginTop: "24px", paddingTop: "12px", paddingBottom: "8px", fontSize: "13px" }}>
          For queries, contact the college administration &nbsp;·&nbsp; Data is updated by the institution.
        </div>

      </div>
    </div>
  );
}

export default StudentDetails;
