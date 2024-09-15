const Bus = require('../models/Bus');

// Add a New Bus
exports.addBus = async (req, res) => {
    try {
        const { busNumber, driverName, departure, destination, seatsAvailable, departureTime, arrivalTime } = req.body;

        // Create a new Bus document
        const newBus = new Bus({
            busNumber,
            driverName,
            departure,
            destination,
            seatsAvailable,
            departureTime,
            arrivalTime
        });

        // Save the bus to the database
        await newBus.save();


        // const buses = req.body; // Expecting an array of bus objects

        // if (!Array.isArray(buses)) {
        //     return res.status(400).json({ message: 'Invalid input: Expected an array of buses' });
        // }

        // // Create and save multiple Bus documents
        // const savedBuses = await Bus.insertMany(buses);

        res.status(201).json({ message: 'Bus added successfully', bus: newBus });
        
    } catch (error) {
        console.error('Error adding bus:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Fetch All Available Buses
exports.getBuses = async (req, res) => {
    try {
        // Fetch all buses from the database
        const buses = await Bus.find();

        res.status(200).json(buses);
    } catch (error) {
        console.error('Error fetching buses:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Fetch Specific Bus Details by ID
exports.getBusDetails = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the bus by ID
        const bus = await Bus.findById(id);

        if (!bus) {
            return res.status(404).json({ message: 'Bus not found' });
        }

        res.status(200).json(bus);
    } catch (error) {
        console.error('Error fetching bus details:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Search Buses
exports.searchBus = async (req, res) => {
    const { origin, destination } = req.query;

    // Log the incoming request parameters for debugging
    console.log('Search parameters:', { origin, destination });

    // Check for missing fields
    if (!origin || !destination) {
        return res.status(400).json({ error: 'All search fields are required' });
    }

    try {
        // Find buses based on origin and destination
        const buses = await Bus.find({
            departure: origin,
            destination
        });

        // Check if any buses were found
        if (buses.length === 0) {
            return res.status(404).json({ message: 'No buses found' });
        }

        // Return the found buses
        res.status(200).json(buses);
    } catch (error) {
        console.error('Error searching for buses:', error); // Log the error for debugging
        res.status(500).json({ error: 'Server Error' });
    }
};


exports.updateBus = async (req, res) => {
    const {id} = req.params;
    const { busNumber, driverName, departure, destination, seatsAvailable, departureTime, arrivalTime } = req.body;
    
    // Check if all required fields are present
    if (!busNumber|| !driverName || !departure || !destination || !seatsAvailable || !departureTime || !arrivalTime) {
        return res.status(400).json({ error: 'All fields are required' });
        }
    
    try {
        // Find the bus to update by ID
        const bus = await Bus.findByIdAndUpdate(id, {
            busNumber,
            driverName,
            departure,
            destination,
            seatsAvailable,
            departureTime,
            arrivalTime
        }, { new: true });

        res.status(200).json({ message: 'Bus updated successfully', updatedBus: bus });
        
    } catch (error) {
        console.log('Error  updating bus: ', error);
        res.status(500).json({ error: 'Server Error while updating the bus...' });
    }
}

exports.deleteBus = async (req, res) => {
    const { id } = req.params;

    try {
        const bus = await Bus.findByIdAndDelete(id);
        
        if(!bus){
            return res.status(404).json({ message: 'Bus not found' });
        }
        
    } catch (error) {
        res.status(500).json({ error: 'Server Error while deleting the bus...' });
        
    }


    res.status(200).json({message: 'Bus deleted Successfully'});
}