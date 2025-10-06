const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const userRoutes = require('./routes/UserRoute');
const locationRoutes = require('./routes/LocationRoute');
const blogRoutes = require('./routes/BlogRoute');
const adminRoutes = require('./routes/AdminRoute');
const bookingRoutes = require('./routes/BookingRoute');
const petRoutes = require('./routes/PetRoute');
const vetRoutes = require('./routes/VetRoute');
const paymentRoutes = require('./routes/PaymentRoute');
const chatRoutes = require('./routes/ChatRoute')
const cookieParser = require('cookie-parser');
const main = require('./utils/seeder');

dotenv.config();

const app = express();

// Middleware to parse JSON bodies.
app.use(cookieParser());
app.use(express.json());
app.use(cors({
  origin: process.env.CORS_URL || "http://localhost:3000",  // your Next.js URL
  credentials: true,                // allow cookies
}));

app.use('/api/users', userRoutes);

app.use('/api/admin', adminRoutes);
app.use('/api/vet', vetRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/booking', bookingRoutes);
app.use('/api/pet', petRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/chat', chatRoutes);

app.use('/api/locations', locationRoutes);
app.get('/', (req, res) => {
    res.status(200).json({ message: 'Welcome to the OOP Backend API!' });
});

// main();

module.exports = app;