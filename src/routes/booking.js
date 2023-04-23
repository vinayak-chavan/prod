const express = require('express');
const { auth } = require("../middlewares/auth");
const { bookingValidation } = require("../controllers/booking/booking.validation");
const { isAdmin } = require("../middlewares/isAdmin");

const {
  addBooking,
  cancelBooking,
  viewBookingByUser,
  viewBookingByTrip,
  addBookingView,
} = require("../controllers/booking/booking.controller");

const route = express.Router();

// user routes
route.post('/booking/:tripId', auth, bookingValidation, addBooking);
route.get('/cancel/:id', auth, cancelBooking);
route.get('/mybooking', auth, viewBookingByUser);
route.get('/booking/:tripId', auth, addBookingView);

// admin routes
route.get("/bookings/:tripId", auth, isAdmin, viewBookingByTrip);

module.exports = route;
