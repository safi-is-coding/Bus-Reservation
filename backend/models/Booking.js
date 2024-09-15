const mongoose = require('mongoose');
const BookingSchema = new mongoose.Schema({
    userId: 
    { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    },
    busId: 
    { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Bus' 
    },
    seatsBooked: Number,
    bookingDate: 
    { 
        type: Date, 
        default: Date.now 
    }
});
module.exports = mongoose.model('Booking', BookingSchema);

