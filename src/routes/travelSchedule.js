const express = require('express');
const { auth } = require("../middlewares/auth");
const { tripValidation } = require('../controllers/travelSchedule/travelSchedule.validation');
const { isAdmin } = require("../middlewares/isAdmin");

const {
  addSchedule,
  viewSchedule,
  deleteSchedule,
  SearchSchedule,
  addTripView,
} = require("../controllers/travelSchedule/travelSchedule.controller");

const route = express.Router();

// routes for admin
route.post("/trip", auth, isAdmin, tripValidation, addSchedule);
route.get("/trip/:busId", auth, isAdmin, viewSchedule);
route.get("/trips/:busId", auth, isAdmin, addTripView)
route.delete('/trip/:id', auth, isAdmin, deleteSchedule);

//routes for user
route.post("/schedule", SearchSchedule);

module.exports = route;
