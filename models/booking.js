const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Only the predefined fictional card is supported; its security code is not stored.
const bookingSchema = new Schema({
  personName: {
    type: String,
    required: true
  },
  personId: {
    type: String,
    required: true,
    minLength: 10,
    maxLength: 10
  },
  sessionDateTime: {
    type: Date,
    required: true
  },
  demoCardNumber: {
    type: String,
    required: true
  },
  demoCardExpiry: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    // Mongoose calls this for each new document, rather than at startup.
    default: Date.now
  }
}, {
  // Reject operations without a connection instead of queueing them in memory.
  bufferCommands: false
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
