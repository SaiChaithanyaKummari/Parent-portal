const mongoose = require('mongoose');

const academicSchema = new mongoose.Schema({
    _id: Number,
    studentId: Number,
    currentSubjects: [mongoose.Schema.Types.Mixed],
    exams: [mongoose.Schema.Types.Mixed],
    notices: [mongoose.Schema.Types.Mixed],
    semesterHistory: [mongoose.Schema.Types.Mixed]
}, { collection: 'academic-Records' });

module.exports = mongoose.model('Academic', academicSchema);
