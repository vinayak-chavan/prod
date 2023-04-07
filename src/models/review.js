const mongoose = require('mongoose');
const Schema = require("mongoose");

const reviewSchema = new mongoose.Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  date: {
    type: Date,
    default: new Date(),
    required: true,
    trim: true,
  },
  sender: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  text: {
    type: String,
    required: true,
    trim: true,
  }
});

const review = new mongoose.model('review', reviewSchema);

module.exports = review;
