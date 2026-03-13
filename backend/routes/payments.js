const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const { auth } = require('../middleware/auth');

// @route   GET /api/payments/me
// @desc    Get current student's payment records
// @access  Private
router.get('/me', auth, async (req, res) => {
    try {
        const studentId = req.user.studentId;
        const paymentData = await Payment.findOne({ studentId });

        if (!paymentData) {
            return res.status(404).json({ message: 'Payment records not found in DB' });
        }
        res.json(paymentData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   POST /api/payments/me
// @desc    Process a new payment transaction
// @access  Private
router.post('/me', auth, async (req, res) => {
    try {
        const studentId = req.user.studentId;
        
        let paymentData = await Payment.findOne({ studentId });
        if (!paymentData) {
            // Technically should never happen since we dump from seeded DB
            paymentData = new Payment({ _id: Date.now(), studentId, transactions: [] });
        }

        const newTxn = {
            id: `TXN${Math.floor(Math.random() * 10000)}`,
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
            amount: req.body.amount || 0,
            type: req.body.type || 'Miscellaneous Fee',
            status: 'Paid'
        };

        // Push new transaction to the array
        paymentData.transactions.push(newTxn);
        
        // This will mark Mixed array as modified for Mongoose wrapper
        paymentData.markModified('transactions');
        await paymentData.save();

        res.json({ message: 'Payment successfully added', transaction: newTxn });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
