const Booking = require('../Models/bookingSchema');
const Test = require('../Models/testSchema');
const Patient = require('../Models/patientSchema');
const { validationResult } = require('express-validator');

// Create a new booking
exports.createBooking = async (req, res) => {
    try {
        // Validate request
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // Format validation errors in a frontend-friendly way
            const formattedErrors = {};
            errors.array().forEach(error => {
                formattedErrors[error.path] = error.msg;
            });

            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: formattedErrors
            });
        }

        const {
            testId,
            appointmentDate,
            notes
        } = req.body;

        // Check if test exists
        const test = await Test.findById(testId);
        if (!test) {
            return res.status(404).json({
                success: false,
                message: 'Test not found',
                error: 'The selected test does not exist or has been removed'
            });
        }

        // Create new booking
        const booking = new Booking({
            patient: req.patient.id, // From auth middleware
            test: testId,
            appointmentDate,
            notes
        });

        await booking.save();

        const populatedBooking = await Booking.findById(booking._id)
            .populate('test', 'name description price')
            .populate('patient', 'name email phone');

        res.status(201).json({
            success: true,
            message: 'Booking created successfully',
            booking: populatedBooking
        });

    } catch (error) {
        console.error('Create booking error:', error);
        res.status(500).json({
            success: false,
            message: 'Unable to create booking',
            error: error.message || 'Server error during booking creation'
        });
    }
};

// Get all bookings for the authenticated patient
exports.getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ patient: req.patient.id })
            .populate('test', 'name description price')
            .sort({ appointmentDate: -1 });

        res.json({
            success: true,
            message: 'Bookings retrieved successfully',
            bookings
        });
    } catch (error) {
        console.error('Get bookings error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve bookings',
            error: error.message || 'Server error while fetching bookings'
        });
    }
};

// Cancel booking
exports.cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        // Check if booking exists
        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found',
                error: 'The booking you are trying to cancel does not exist'
            });
        }

        // Check if booking belongs to authenticated patient
        if (booking.patient.toString() !== req.patient.id && !req.isAdmin) {
            return res.status(403).json({
                success: false,
                message: 'Access denied',
                error: 'You can only cancel your own bookings'
            });
        }

        // Check if booking can be cancelled
        if (booking.status === 'completed') {
            return res.status(400).json({
                success: false,
                message: 'Cannot cancel a completed booking',
                error: 'Completed tests cannot be cancelled'
            });
        }

        // Update booking status
        booking.status = 'cancelled';
        await booking.save();

        res.json({
            success: true,
            message: 'Booking cancelled successfully',
            booking
        });
    } catch (error) {
        console.error('Cancel booking error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to cancel booking',
            error: error.message || 'Server error while cancelling booking'
        });
    }
};

// Update booking status (for admins)
exports.updateBookingStatus = async (req, res) => {
    try {
        const { status } = req.body;

        // Validate status
        const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status value',
                error: 'Status must be one of: pending, confirmed, completed, cancelled'
            });
        }

        const booking = await Booking.findById(req.params.id);

        // Check if booking exists
        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found',
                error: 'The booking you are trying to update does not exist'
            });
        }

        // Only admin can update status (except cancellation which patients can do too)
        if (!req.isAdmin && status !== 'cancelled') {
            return res.status(403).json({
                success: false,
                message: 'Access denied',
                error: 'Only administrators can update booking status'
            });
        }

        // If patient is cancelling, make sure it's their booking
        if (status === 'cancelled' && !req.isAdmin && booking.patient.toString() !== req.patient.id) {
            return res.status(403).json({
                success: false,
                message: 'Access denied',
                error: 'You can only cancel your own bookings'
            });
        }

        // Prevent updating completed bookings
        if (booking.status === 'completed' && status !== 'completed') {
            return res.status(400).json({
                success: false,
                message: 'Cannot modify completed booking',
                error: 'Completed bookings cannot be changed to another status'
            });
        }

        // Update booking status
        booking.status = status;
        await booking.save();

        res.json({
            success: true,
            message: 'Booking status updated successfully',
            booking
        });

    } catch (error) {
        console.error('Update booking status error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update booking status',
            error: error.message || 'Server error while updating booking status'
        });
    }
};

// Download test report
exports.downloadReport = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        // Check if booking exists
        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found',
                error: 'The booking for this report does not exist'
            });
        }

        // Check if booking belongs to authenticated patient
        if (booking.patient.toString() !== req.patient.id && !req.isAdmin) {
            return res.status(403).json({
                success: false,
                message: 'Access denied',
                error: 'You can only download reports for your own bookings'
            });
        }

        // Check if booking is completed and has a report
        if (booking.status !== 'completed') {
            return res.status(400).json({
                success: false,
                message: 'Report not available',
                error: 'Test must be completed before the report can be downloaded'
            });
        }

        // For now, we'll create a dummy PDF report
        const fs = require('fs');
        const path = require('path');

        // Create reports directory if it doesn't exist
        const reportsDir = path.join(__dirname, '../reports');
        if (!fs.existsSync(reportsDir)) {
            fs.mkdirSync(reportsDir, { recursive: true });
        }

        // For demo purposes, let's create a dummy PDF file with some patient info
        const PDFDocument = require('pdfkit');
        const reportPath = path.join(reportsDir, `report_${booking._id}.pdf`);

        // Create a document
        const doc = new PDFDocument();
        const writeStream = fs.createWriteStream(reportPath);
        doc.pipe(writeStream);

        // Add content to PDF
        doc.fontSize(25).text('Medical Test Report', { align: 'center' });
        doc.moveDown();
        doc.fontSize(14).text(`Patient ID: ${booking.patient}`, { align: 'left' });
        doc.moveDown(0.5);
        doc.fontSize(14).text(`Test ID: ${booking.test}`, { align: 'left' });
        doc.moveDown(0.5);
        doc.fontSize(14).text(`Date: ${new Date().toLocaleDateString()}`, { align: 'left' });
        doc.moveDown(0.5);
        doc.fontSize(14).text(`Appointment Date: ${new Date(booking.appointmentDate).toLocaleDateString()}`, { align: 'left' });
        doc.moveDown(0.5);
        doc.fontSize(14).text(`Status: ${booking.status}`, { align: 'left' });
        doc.moveDown(2);
        doc.fontSize(16).text('Test Results', { align: 'center' });
        doc.moveDown();
        doc.fontSize(12).text('This is a dummy test report for demonstration purposes.');
        doc.moveDown();
        doc.fontSize(12).text('Please consult with your healthcare provider for the interpretation of these results.');
        doc.moveDown(2);
        doc.fontSize(10).text('© 2025 Mannat Medical Laboratory. All Rights Reserved.', { align: 'center' });

        // Finalize PDF file
        doc.end();

        // Wait for the PDF to be created
        writeStream.on('finish', () => {
            // Update booking with report URL if not already set
            if (!booking.reportUrl) {
                booking.reportUrl = `/api/bookings/${booking._id}/report`;
                booking.save().catch(err => console.error('Error saving report URL:', err));
            }

            // Send the file
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=report_${booking._id}.pdf`);
            fs.createReadStream(reportPath).pipe(res);
        });

        writeStream.on('error', (error) => {
            console.error('Error generating PDF:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to generate report',
                error: 'An error occurred while creating your PDF report'
            });
        });

    } catch (error) {
        console.error('Download report error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to download report',
            error: error.message || 'Server error while downloading report'
        });
    }
};
