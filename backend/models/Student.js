const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    _id: Number,
    name: String,
    grade: String,
    address: mongoose.Schema.Types.Mixed,
    attendance: Number,
    feeDue: Number,
    parentId: Number,
    busNumber: String,
    route: String,
    driver: String,
    admissionDate: String,
    batch: String,
    branch: String,
    caste: String,
    dob: String,
    gender: String,
    id: Number,
    parentPhone: String,
    program: String,
    studentPhone: String,
    yearOfJoin: String
}, { collection: 'student-details' });

module.exports = mongoose.model('Student', studentSchema);
