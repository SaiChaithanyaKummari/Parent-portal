const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    _id: Number,
    studentId: Number,
    transactions: [mongoose.Schema.Types.Mixed]
}, { collection: 'Paymentrecords' });

module.exports = mongoose.model('Payment', paymentSchema);
