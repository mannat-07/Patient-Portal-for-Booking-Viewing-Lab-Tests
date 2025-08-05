const { Schema, model } = require('mongoose');

const bookingSchema = new Schema({
    patient: {
        type: Schema.Types.ObjectId,
        ref: 'Patient',
        required: true
    },
    test: {
        type: Schema.Types.ObjectId,
        ref: 'Test',
        required: true
    },
    bookingDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    appointmentDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'completed', 'cancelled'],
        default: 'pending'
    },
    notes: {
        type: String,
        trim: true
    },
    reportUrl: {
        type: String,
        default: null
    }
}, {
    timestamps: true
});

// Create indexes for faster queries
bookingSchema.index({ patient: 1, appointmentDate: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ appointmentDate: 1 });

const Booking = model('Booking', bookingSchema);

module.exports = Booking;