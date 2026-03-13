const mongoose = require('mongoose');

const parentSchema = new mongoose.Schema({
    _id: Number,
    name: String,
    email: String,
    password: { type: String, select: false },
    studentId: Number
}, { collection: 'parents' });

module.exports = mongoose.model('Parent', parentSchema);
