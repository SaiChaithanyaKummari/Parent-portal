const mongoose = require('mongoose');

const credentialSchema = new mongoose.Schema({
    _id: Number,
    role: String,
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    linkedId: Number
}, { collection: 'login-credentials' });

module.exports = mongoose.model('Credential', credentialSchema);
