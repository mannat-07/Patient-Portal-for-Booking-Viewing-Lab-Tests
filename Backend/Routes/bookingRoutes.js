const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const bookingController = require('../Controllers/bookingController');
const verifyToken = require('../Middleware/auth');

// All booking routes require authentication
router.use(verifyToken);

// Validation rules
const bookingValidation = [
    check('testId', 'Test ID is required').not().isEmpty(),
    check('appointmentDate', 'Valid appointment date is required').isISO8601(),
    check('appointmentTime', 'Valid appointment time is required').not().isEmpty()
];

// Create a new booking
router.post('/', bookingValidation, bookingController.createBooking);

// Get all bookings for the authenticated patient
router.get('/my-bookings', bookingController.getMyBookings);

// Cancel booking
router.post('/:id/cancel', bookingController.cancelBooking);

// Update booking status (admin access)
router.patch('/:id/status', bookingController.updateBookingStatus);

// Download test report
router.get('/:id/report', bookingController.downloadReport);

module.exports = router;
