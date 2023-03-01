const express = require("express");
const { viewAttendance, addAttendance, addReview, viewReviewsByOwn, searchAttendance, addAttendanceView, viewReviewsByOthers, addReviewView } = require('../controllers/atttendance.controller');
const { auth } = require("../middlewares/auth");
const attendance = require("../models/attendance");

const route = express.Router();

route.get("/attendancePage", auth, addAttendanceView);
route.post("/searchAttendance", auth, viewAttendance);
route.post("/attendance", auth, addAttendance);
route.get("/serachAttendance", auth, searchAttendance);

route.post("/review", auth, addReview);
route.get("/addReview/:id", auth, addReviewView);
route.get("/reviews", auth, viewReviewsByOwn);
route.get("/review/:id", auth, viewReviewsByOthers);

module.exports = route;