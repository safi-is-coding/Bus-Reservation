const Booking = require('../models/Booking');
const Bus = require('../models/Bus'); // To update seatsAvailable in the Bus model
const User = require('../models/User');


// Book Seats
exports.bookSeats = async (req, res) => {
    try {
        const { userId, busId, seatsBooked } = req.body;

        // Find the bus and check if enough seats are available
        const bus = await Bus.findById(busId);

        if (!bus) {
            return res.status(404).json({ message: 'Bus not found' });
        }

        if (bus.seatsAvailable < seatsBooked) {
            return res.status(400).json({ message: 'Not enough seats available' });
        }
        

        // Create a new booking
        const newBooking = new Booking({
            userId,
            busId,
            seatsBooked
        });

        // Save the booking
        await newBooking.save();

        // Update the bus to reflect the new number of available seats
        bus.seatsAvailable -= seatsBooked;
        await bus.save();

        res.status(201).json({ message: 'Booking successful', booking: newBooking });
    } catch (error) {
        console.error('Error booking seats:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get User Bookings by a User
exports.getUserBookings = async (req, res) => {
    try {
        const userId = req.params.userId;

        // Find all bookings for the user
        const bookings = await Booking.find({ userId }).populate('busId', 'busNumber departure destination'); // Populate bus details

        if (!bookings.length) {
            return res.status(404).json({ message: 'No bookings found for this user' });
        }

        res.status(200).json(bookings);
    } catch (error) {
        console.error('Error fetching user bookings:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


exports.getAllBookings = async (req, res) => {
    try {
        // Find all bookings and populate related user and bus information
        const bookings = await Booking.find()
            .populate('userId', 'name email') // Populate user details (name, email)
            .populate('busId', 'busNumber departure destination'); // Populate bus details (busNumber, departure, destination)

        if (!bookings.length) {
            return res.status(404).json({ message: 'No bookings found' });
        }

        res.status(200).json(bookings);
    } catch (error) {
        console.error('Error fetching all bookings:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
