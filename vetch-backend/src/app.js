const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/UserRoute');
const locationRoutes = require('./routes/LocationRoute');
const blogRoutes = require('./routes/BlogRoute');
const adminRoutes = require('./routes/AdminRoute');
const bookingRoutes = require('./routes/BookingRoute');
const petRoutes = require('./routes/PetRoute');
const vetRoutes = require('./routes/VetRoute');
const midtransRoutes = require('./routes/MidtransRoute');
const cookieParser = require('cookie-parser');
const main = require('./utils/seeder');

const app = express();

// Middleware to parse JSON bodies.
app.use(cookieParser());
app.use(express.json());
app.use(cors({
  origin: "http://localhost:3000",  // your Next.js URL
  credentials: true,                // allow cookies
}));

app.use('/api/users', userRoutes);

app.use('/api/admin', adminRoutes);
app.use('/api/vet', vetRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/booking', bookingRoutes);
app.use('/api/pet', petRoutes);
app.use('/api/payment', midtransRoutes);

app.use('/api/locations', locationRoutes);
app.get('/', (req, res) => {
    res.status(200).json({ message: 'Welcome to the OOP Backend API!' });
});

// main();

module.exports = app;