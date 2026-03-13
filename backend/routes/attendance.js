const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const { auth } = require('../middleware/auth');

// @route   GET /api/attendance/me
// @desc    Get current student's attendance records
// @access  Private
router.get('/me', auth, async (req, res) => {
    try {
        const studentId = req.user.studentId;
        const attendanceData = await Attendance.findOne({ studentId });

        if (!attendanceData) {
            return res.status(404).json({ message: 'Attendance records not found in DB' });
        }
        res.json(attendanceData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
