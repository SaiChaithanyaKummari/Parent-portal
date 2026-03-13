const express = require("express");
const router = express.Router();

const Student = require("./models/Student");
const Parent = require("./models/Parent");
const AcademicRecord = require("./models/AcademicRecord");
const AttendanceRecord = require("./models/AttendanceRecord");
const PaymentRecord = require("./models/PaymentRecord");


// Get student summary
router.get("/students-summary", async (req, res) => {
  try {

    const students = await Student.find();
    const result = [];

    for (let s of students) {

      const acad = await AcademicRecord.findOne({ studentId: s._id });
      const att = await AttendanceRecord.findOne({ studentId: s._id });
      const pay = await PaymentRecord.findOne({ studentId: s._id });

      result.push({
        studentId: s._id,
        name: s.name,
        academicRecord: !!acad,
        attendanceRecord: !!att,
        paymentRecord: !!pay,
        attendanceStats: att
          ? {
              summaryStats: att.summaryStats?.length || 0,
              monthlyData: att.monthlyData?.length || 0,
              subjects: att.subjects?.length || 0,
              attendanceMapKeys: Object.keys(att.attendanceMap || {}).length
            }
          : null,
        paymentStats: pay
          ? {
              transactions: pay.transactions?.length || 0
            }
          : null
      });
    }

    res.json(result);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Parent Login
router.post("/login", async (req, res) => {

  try {

    const { email, password } = req.body;

    const parent = await Parent.findOne({ email, password });

    if (!parent) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const student = await Student.findById(parent.studentId);

    const userObj = {
      type: "parent",
      parent,
      student
    };

    res.json({
      message: "Login successful",
      user: userObj
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }

});


// Get academic results
router.get("/results/:studentId", async (req, res) => {

  try {

    const academic = await AcademicRecord.findOne({
      studentId: req.params.studentId
    });

    if (!academic) {
      return res.status(404).json({
        message: "No academic record found"
      });
    }

    res.json(academic);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }

});


module.exports = router;