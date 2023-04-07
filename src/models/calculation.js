const mongoose = require('mongoose');
const Schema = require("mongoose");

const calculationSchema = new mongoose.Schema({
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
  totalOutput: {
    type: Number,
    required: false,
    trim: true,
  },
  labourInput: {
    type: Number,
    required: false,
    trim: true,
  },
  materialInput: {
    type: Number,
    required: false,
    trim: true,
  },
  capitalInput: {
    type: Number,
    required: false,
    trim: true,
  },
  energyInput: {
    type: Number,
    required: false,
    trim: true,
  },
  labourProductivity: {
    type: Number,
    required: false,
    trim: true,
  },
  materialProductivity: {
    type: Number,
    required: false,
    trim: true,
  },
  capitalProductivity: {
    type: Number,
    required: false,
    trim: true,
  },
  energyProductivity: {
    type: Number,
    required: false,
    trim: true,
  },
  totalProductivity: {
    type: Number,
    required: false,
    trim: true,
  }
});

const calculation = new mongoose.model('calculation', calculationSchema);

module.exports = calculation;
