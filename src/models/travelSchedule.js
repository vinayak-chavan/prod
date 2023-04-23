const mongoose = require("mongoose");
const Schema = require("mongoose");

const travelScheduleSchema = new mongoose.Schema({
  busId: {
    type: Schema.Types.ObjectId,
  },
  startingPoint: {
    type: String,
    required: true,
    trim: true,
  },
  destinationPoint: {
    type: String,
    required: true,
    trim: true,
  },
  intermediate: {
    type: [],
  },
  travelDate: {
    type: Date,
    required: true,
    trim: true,
  },
  departureTime: {
    type: String,
    required: true,
    trim: true,
  },
  reachTime: {
    type: String,
    required: true,
    trim: true,
  },
  fareAmount: {
    type: Number,
    required: true,
    trim: true,
  },
  totalBooking: {
    type: Number,
    required: true,
    trim: true,
  },
  availableSeats: {
    type: [],
  },
});

const travelSchedule = new mongoose.model("travelSchedule", travelScheduleSchema);

module.exports = travelSchedule;
