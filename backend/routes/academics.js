const express = require('express');
const router = express.Router();
const Academic = require('../models/Academic');
const { auth } = require('../middleware/auth');

// @route   GET /api/academics/me
// @desc    Get current student's academic records
// @access  Private
router.get('/me', auth, async (req, res) => {
    try {
        const studentId = req.user.studentId;
        const academicData = await Academic.findOne({ studentId });

        if (!academicData) {
            return res.status(404).json({ message: 'Academic records not found in DB' });
        }
        res.json(academicData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
