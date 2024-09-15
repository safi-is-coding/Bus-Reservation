const express = require('express');
const { bookSeats, getUserBookings, getAllBookings } = require('../controllers/bookingController');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

// Route to book seats
router.post('/book', protect, bookSeats);

// get all the bookings
router.get('/allBookings', protect, admin , getAllBookings);

// Route to get user bookings with userId as a parameter
router.get('/mybookings/:userId', protect, getUserBookings);

module.exports = router;
