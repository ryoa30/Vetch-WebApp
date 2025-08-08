const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/UserRoute');

const app = express();

// Middleware to parse JSON bodies.
app.use(express.json());
app.use(cors());

app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
    res.status(200).json({ message: 'Welcome to the OOP Backend API!' });
});

module.exports = app;