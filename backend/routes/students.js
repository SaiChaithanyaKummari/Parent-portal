const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const { auth } = require('../middleware/auth');

// @route   GET /api/students/me
// @desc    Get current student's details
// @access  Private
router.get('/me', auth, async (req, res) => {
    try {
        const studentId = req.user.studentId;
        const student = await Student.findById(studentId);

        if (!student) {
            return res.status(404).json({ message: 'Student not found in DB' });
        }
        res.json(student);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   PUT /api/students/me
// @desc    Update current student's details
// @access  Private
router.put('/me', auth, async (req, res) => {
    try {
        const studentId = req.user.studentId;
        const allowedUpdates = ['address', 'studentPhone', 'parentPhone'];

        const updates = {};
        allowedUpdates.forEach(field => {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        });

        const student = await Student.findByIdAndUpdate(
            studentId,
            { $set: updates },
            { new: true, runValidators: true }
        );

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        res.json(student);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
