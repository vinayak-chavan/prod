const mongoose = require('mongoose');
const Schema = require("mongoose");

const bookingSchema = new mongoose.Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  travelScheduleId: {
    type: Schema.Types.ObjectId,
    ref: "travelSchedule",
  },
  seats: {
    type: Number,
    required: true,
    trim: true,
  },
  totalAmount: {
    type: Number,
    required: true,
    trim: true,
  },
  bookingDate: {
    type: Date,
    required: true,
    trim: true,
  },
  status: {
    type: String,
    required: true,
    enum: ["Confirmed", "Canceled"],
    trim: true,
  },
  bookedSeats: {
    type: [],
    require: true,
  },
});

const booking = new mongoose.model('booking', bookingSchema);

module.exports = booking;
