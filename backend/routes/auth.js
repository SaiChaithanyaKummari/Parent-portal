const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Credential = require('../models/Credential');
const Parent = require('../models/Parent');
const Student = require('../models/Student');

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Verify credential exists
        const cred = await Credential.findOne({ email });
        if (!cred) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, cred.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // We only support parents for parent-portal
        if (cred.role !== 'parent') {
            return res.status(403).json({ message: 'Access denied: Parent role required' });
        }

        // Get Parent document using linkedId
        const parent = await Parent.findById(cred.linkedId);
        if (!parent) {
            return res.status(404).json({ message: 'Parent profile not found mapping to this credential' });
        }

        // Get Student document using studentId mapping in Parent
        const student = await Student.findById(parent.studentId);
        if (!student) {
            return res.status(404).json({ message: 'Linked student profile not found' });
        }

        const payload = {
            id: cred._id,
            role: cred.role,
            linkedId: cred.linkedId,
            studentId: parent.studentId
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '10h' });

        res.json({
            token,
            user: {
                id: cred._id,
                name: parent.name,
                email: cred.email,
                type: cred.role,
                linkedId: cred.linkedId,
                student: {
                    _id: student._id,
                    name: student.name,
                    id: student._id,
                    grade: student.grade,
                    studentId: student._id,
                    feeDue: student.feeDue
                }
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
