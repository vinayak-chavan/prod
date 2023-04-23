const mongoose = require('mongoose');

const bus = require('../../models/bus');
const travelSchedule = require('../../models/travelSchedule');

const { successResponse, errorResponse } = require('../../utils');

const viewBus = async (req, res) => {
  try {
    const busData = await bus.find();

    // check if bus is exist or not
    if (!busData) {
      return errorResponse(req, res, 'bus Not Found', 404);
    } else {
      res.render("viewBus", {
        buses: busData,
        success: "",
      });
      // return successResponse(req, res, busData, 200);
    }

  } catch (error) {
    return errorResponse(req, res, 'something went wrong', 400, { err: error });
  }
};

const addBus = async (req, res) => {
  try {
    const { busnumber } = req.body.busnumber;

    // check if bus allready registered or not
    const busData = await bus.findOne({ busnumber: busnumber });
    if (busData) {
      return errorResponse(req, res, 'bus allready registered', 400);
    };

    const payload = req.body;

    // insert bus payload in database
    const newbus = new bus(payload);
    const insertBus = await newbus.save();

    res.redirect('bus');
    // return successResponse(req, res, insertBus, 200);
  } catch (error) {
    return errorResponse(req, res, 'something went wrong', 500, { err: error });
  }
};

const addBusView = async (req, res) => {
  res.render("addBus");
};

const deleteBus = async (req, res) => {
  try {
    const { id } = req.params;

    // check if bus exist or not
    const busData = await bus.findOne({ _id: id });
    if (!busData) {
      return errorResponse(req, res, 'bus not found', 404);
    }

    // deleteing bus from database
    const deleteBusData = await bus.findByIdAndDelete(id);

    // deleteing travel schedule related to that bus
    const deleteTripData = await travelSchedule.deleteMany({ busId: id });
    res.redirect("/bus");
    
  } catch (error) {
    return errorResponse(req, res, 'something went wrong', 400, { err: error });
  }
};

module.exports = { viewBus, addBus, deleteBus, addBusView };
