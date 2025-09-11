const express = require('express');
const cors = require('cors');
const axios = require('axios');
const userRoutes = require('./routes/UserRoute');
const locationRoutes = require('./routes/LocationRoute');

const app = express();

// Middleware to parse JSON bodies.
app.use(express.json());
app.use(cors());

app.use('/api/users', userRoutes);

app.use('/api/locations', locationRoutes);
app.get('/', (req, res) => {
    res.status(200).json({ message: 'Welcome to the OOP Backend API!' });
});



module.exports = app;