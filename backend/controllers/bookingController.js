const User = require('../models/User');

const Bus = require('../models/Bus');
const Booking = require('../models/Booking');
const { sendMail } = require('../utils/email');
const { generateEmailTemplate } = require('../views/emailTemplates');

// Book seats on a bus
exports.bookSeats = async (req, res) => {
    try {
        const { userId, busId, seatsBooked, userEmail } = req.body;

        // Find the bus by ID
        const bus = await Bus.findById(busId);
        const user = await User.findById(userId);

        // Check if the bus exists
        if (!bus) {
            return res.status(404).json({ message: 'Bus not found' });
        }

        // Check if enough seats are available
        if (bus.seatsAvailable < seatsBooked) {
            return res.status(400).json({ message: 'Not enough seats available' });
        }

        // Create a new booking
        const newBooking = new Booking({
            userId,
            busId,
            seatsBooked
        });

        // Save the booking in the database
        await newBooking.save();

        // Update the bus seat availability
        bus.seatsAvailable -= seatsBooked;
        
        // Prepare bus details for the email
        // const busDetails = {
            //     busNumber: bus.busNumber,
        //     departure: bus.departure,
        //     destination: bus.destination,
        //     seatsBooked: seatsBooked
        // };
        
        // // Generate the email content
        // const emailContent = generateEmailTemplate(user.name, busDetails);
        
        // // Send a confirmation email to the user
        // await sendMail(userEmail, 'Bus Booking Confirmation', emailContent);
        
        
        await bus.save();

        
        // Send response back to the client
        res.status(201).json({ message: 'Booking successful', booking: newBooking });

    } catch (error) {
        console.error('Error booking seats:', error);
        res.status(500).json({ message: 'Server error while booking seat' });
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
