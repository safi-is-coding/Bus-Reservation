const express = require('express');
const { addBus, getBuses, getBusDetails, searchBus, updateBus, deleteBus } = require('../controllers/busController');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

// add new bus route
router.post('/add', protect, admin, addBus);

// delete bus route
router.delete('/:id', protect, admin, deleteBus);

//update bus route
router.put('/:id', protect, admin, updateBus);

// display buses route
router.get('/', getBuses);

// search bus route
router.get('/search', searchBus);


router.get('/:id', getBusDetails);


module.exports = router;
