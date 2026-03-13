const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

require('dotenv').config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/students', require('./routes/students'));
app.use('/api/attendance', require('./routes/attendance'));
app.use('/api/academics', require('./routes/academics'));
app.use('/api/payments', require('./routes/payments'));

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'New MongoDB-only Backend API is running' });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5002;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;
