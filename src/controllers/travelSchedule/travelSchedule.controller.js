const mongoose = require("mongoose");

const travelSchedule = require("../../models/travelSchedule");
const bus = require("../../models/bus");

const { successResponse, errorResponse } = require("../../utils");

let  busID;

const addSchedule = async (req, res) => {
  try {
    
    // check if bus exist or not
    const busData = await bus.findOne({ _id: busID });
    if (!busData) {
      return errorResponse(req, res, "bus not found", 404);
    }

    // check for bus capacity
    let number = busData.capacity;
    const availableSeats = Array.from({ length: number }, (_, index) => index + 1);

    // creating payload
    const payload = {
      busId: busID,
      startingPoint: req.body.startingPoint,
      destinationPoint: req.body.destinationPoint,
      travelDate: req.body.travelDate,
      departureTime: req.body.departureTime,
      reachTime: req.body.reachTime,
      intermediate: req.body.intermediate,
      fareAmount: req.body.fareAmount,
      totalBooking: 0,
      availableSeats: availableSeats,
    };

    // adding new travel schedule
    const newTrip = new travelSchedule(payload);
    const insertTrip = await newTrip.save();

    res.redirect("bus");
    // return successResponse(req, res, insertTrip, 200);
  } catch (error) {
    return errorResponse(req, res, "something went wrong", 500, { err: error });
  }
};

const deleteSchedule = async (req, res) => {
  try {
    const { id } = req.params;

    // check if bus exist or not
    const tripData = await travelSchedule.findOne({ _id: id });
    if (!tripData) {
      return errorResponse(req, res, "trip not found", 404);
    }

    // deleteing bus from database
    const deleteTripData = await travelSchedule.findByIdAndDelete(id);

    return successResponse(
      req,
      res,
      { deleteTripData, success: "TRIP DELETED SUCCESSFULLY" },
      200
    );
  } catch (error) {
    return errorResponse(req, res, "something went wrong", 400, { err: error });
  }
};

const viewSchedule = async (req, res) => {
  try {
    const { busId } = req.params;

    // check if bus exist or not
    const busData = await bus.findOne({ _id: busId });
    if (!busData) {
      return errorResponse(req, res, "bus not found", 404);
    }

    const tripData = await travelSchedule.find({ busId: busId });

    // check if bus is exist or not
    if (!tripData) {
      return errorResponse(req, res, "no trip schedule", 404);
    } else {
      res.render("viewTrips", { trips: tripData });
      // return successResponse(req, res, tripData, 200);
    }
  } catch (error) {
    return errorResponse(req, res, "something went wrong", 400, { err: error });
  }
};

const addTripView = async (req, res) => {
  let { busId } = req.params;
  busID = busId;
  res.render("addTrip");
};

const SearchSchedule = async (req, res) => {
  try {
    const { startingPoint, destinationPoint, travelDate } = req.body;
    // finding trip according to parameters
    const tripData = await travelSchedule.find({
      startingPoint: startingPoint,
      destinationPoint: destinationPoint,
      travelDate: travelDate,
    });

    // check if travel schedule is exist or not
    if(tripData !== undefined) {
      res.render("viewTrip", { trips: tripData, message: 'No Any Schedule Find' });
    } else {
      res.render("viewTrip", { trips: tripData });
      // return successResponse(req, res, tripData, 200);
    }
    
  } catch (error) {
    return errorResponse(req, res, "something went wrong", 400, { err: error });
  }
};


module.exports = { addSchedule, viewSchedule, deleteSchedule, SearchSchedule, addTripView };
