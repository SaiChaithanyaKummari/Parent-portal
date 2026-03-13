const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    _id: Number,
    studentId: Number,
    summaryStats: [mongoose.Schema.Types.Mixed],
    monthlyData: [mongoose.Schema.Types.Mixed],
    attendanceMap: mongoose.Schema.Types.Mixed,
    subjects: [mongoose.Schema.Types.Mixed]
}, { collection: 'Attendancerecords' });

module.exports = mongoose.model('Attendance', attendanceSchema);
