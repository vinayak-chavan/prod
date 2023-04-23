const mongoose = require("mongoose");

const busSchema = new mongoose.Schema({
  busnumber: {
    type: String,
    required: true,
    trim: true,
  },
  busType: {
    type: String,
    required: true,
    enum: ['seating', 'sleeper'],
    trim: true,
  },
  capacity: {
    type: Number,
    required: true,
    trim: true,
  },
});

const bus = new mongoose.model("bus", busSchema);

module.exports = bus;
