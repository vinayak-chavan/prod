const mongoose = require('mongoose');
const Schema = require("mongoose");

const productionSchema = new mongoose.Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  todayProduction: {
    type: Object,
  },
  currentDate: {
    type: Date,
    required: true,
    trim: true,
  },
  weekNumber: {
    type: Number,
    required: true,
  }
});

const production = new mongoose.model('production', productionSchema);

module.exports = production;
