const mongoose = require('mongoose');
const BusSchema = new mongoose.Schema({
    busNumber: {type:String, unique: true},
    driverName: String,
    departure: String,
    destination: String,
    seatsAvailable: Number,
    departureTime: Date,
    arrivalTime: Date
});
module.exports = mongoose.model('Bus', BusSchema);
