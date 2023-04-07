const mongoose = require('mongoose');
const Schema = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  date: {
    type: Date,
    required: true,
    trim: true,
  },
  month: {
    type: Number,
    required: false,
    trim: true,
  },
  year: {
    type: Number,
    required: false,
    trim: true,
  },
  employeeName: {
    type: [],
    require: true,
  },
});

const attendance = new mongoose.model('attendance', attendanceSchema);

module.exports = attendance;
