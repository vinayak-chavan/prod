const mongoose = require("mongoose");
const { difference } = require("lodash");

const user = require("../../models/user");
const bus = require("../../models/bus");
const travelSchedule = require("../../models/travelSchedule");
const booking = require("../../models/booking");

const { successResponse, errorResponse } = require("../../utils/index");
const { sendmail } = require("../../utils/mail");

const addBooking = async (req, res) => {
  try {
    const { tripId } = req.params;
    const userId = req.user._id;

    const { seats, totalAmount, requestedSeats } = req.body;

    let status = "Confirmed";

    // check if trip exist or not
    const tripData = await travelSchedule.findOne({ _id: tripId });
    if (!tripData) return errorResponse(req, res, "trip not found", 404);

    let availableSeatsArray = tripData.availableSeats;
    let busId = tripData.busId;

    const finalReqArr = requestedSeats.map((ele) => parseInt(ele));

    // check if requested seats available or not

    const diffArr = difference(finalReqArr, availableSeatsArray);

    if (diffArr.length) {
      return errorResponse(req, res, "seats already occupied", 500);
    }

    // creating payload
    const payload = {
      userId,
      travelScheduleId: tripId,
      seats,
      totalAmount,
      bookingDate: new Date().toISOString().slice(0, 10),
      status: status,
      bookedSeats: finalReqArr,
    };

    // debiting booking amount from user wallet
    const userInfo = await user.findOne({ _id: userId });
    let value = userInfo.wallet;
    // check if you have sufficient wallet balance to pay
    if (value < totalAmount) {
      return errorResponse(
        req,
        res,
        "dont have sufficeint wallet balance",
        500
      );
    } else {
      // deducting amount from user wallet
      const userData = await user.findOneAndUpdate(
        { _id: userId },
        {
          wallet: value - totalAmount,
        }
      );
    }
    // adding booking data
    const newBooking = new booking(payload);
    const insertBooking = await newBooking.save();

    availableSeatsArray = availableSeatsArray.filter(
      (val) => !finalReqArr.includes(val)
    );

    // counting total bookings
    const busData = await bus.findOne({ _id: busId });
    let totalBooking = busData.capacity - availableSeatsArray.length;

    // removing booked seats from available seats array
    const updatedTripData = await travelSchedule.findByIdAndUpdate(
      { _id: tripId },
      { availableSeats: availableSeatsArray, totalBooking: totalBooking }
    );

    // sending bboking confrimation mail
    sendmail(
      userInfo.emailID,
      "Bus Ticket Booking Confirmation",
      ` <p> hello </p><strong> ${userInfo.username}, </strong> </br>
            <p> your requested tickets ${finalReqArr} has been confirmed</p></br></br>
            <p> Travelling Details </p>
            <p> Bus Number : ${busData.busnumber} <br>
            <p> On Date <strong> ${tripData.travelDate} </strong> </br>
            <p> <strong> ${tripData.startingPoint} - ${tripData.destinationPoint} </strong> </p> </br>
            <p> <strong> ${tripData.departureTime} - ${tripData.reachTime} </strong> </p> </br>`
    );

    res.redirect("/mybooking");
    // return successResponse(req, res, insertBooking, 200);
  } catch (error) {
    return errorResponse(req, res, "something went wrong", 500, { err: error });
  }
};

const viewBookingByUser = async (req, res) => {
  try {
    const userId = req.user._id;
    let status = "Confirmed";

    const bookingData = await booking
      .find({ userId: userId, status: status })
      .populate("travelScheduleId");

    // check if booking is exist or not
    if (!bookingData) {
      return errorResponse(req, res, "you dont have any booking yet", 404);
    } else {
      res.render("myBookings", { bookings: bookingData });
      // return successResponse(req, res, bookingData, 200);
    }
  } catch (error) {
    return errorResponse(req, res, "something went wrong", 400, { err: error });
  }
};

const viewBookingByTrip = async (req, res) => {
  try {
    const { tripId } = req.params;
    let status = "Confirmed";

    const bookingData = await booking
      .find({ travelScheduleId: tripId, status: status })
      .populate("userId", "username");

    // check if booking is exist or not
    if (!bookingData) {
      return errorResponse(req, res, "no any data to show", 404);
    } else {
      res.render("viewBookings", { bookings: bookingData });
      // return successResponse(req, res, bookingData, 200);
    }
  } catch (error) {
    return errorResponse(req, res, "something went wrong", 400, { err: error });
  }
};

const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    let status = "Canceled";

    // check if booking exist or not
    const bookingData = await booking.findOne({ _id: id });
    if (!bookingData) {
      return errorResponse(req, res, "data not found", 404);
    }

    let value = bookingData.totalAmount;
    let userId = bookingData.userId;
    let seats = bookingData.bookedSeats;
    let tripId = bookingData.travelScheduleId;
    let numberOfSeats = bookingData.seats;

    // updating booking status to cancel
    const cancelBookingData = await booking.findByIdAndUpdate(
      { _id: id },
      {
        status: status,
        bookedSeats: [],
      }
    );

    if (!cancelBookingData) {
      return errorResponse(req, res, "something went wrong", 400);
    } else {
      // updating user wallet amount for refund
      const userData = await user.findByIdAndUpdate(
        { _id: userId },
        { $inc: { wallet: value } }
      );

      // updating booked seats to available seats
      const trip = await travelSchedule.findOne({ _id: tripId });
      let availableSeatsArray = trip.availableSeats;
      availableSeatsArray.push(...seats);

      // updating total booking count
      let totalBooking = trip.totalBooking - numberOfSeats;

      const tripData = await travelSchedule.findByIdAndUpdate(
        { _id: tripId },
        { availableSeats: availableSeatsArray, totalBooking: totalBooking }
      );

      const bookingDetails = await booking
        .find({ userId: userId, status: { $ne: status } })
        .populate("travelScheduleId");

      // sending cancelation mail
      sendmail(
        userData.emailID,
        "Bus Ticket Booking Cancelation",
        ` <p> hello </p><strong> ${userData.username}, </strong> </br>
            <p> your requested tickets ${seats} has been canceled</p></br></br>
            <p> Travelling Details </p>
            <p> On Date <strong> ${trip.travelDate} </strong> </br>
            <p> <strong> ${trip.startingPoint} - ${trip.destinationPoint} </strong> </p> </br>
            <p> <strong> ${trip.departureTime} - ${trip.reachTime} </strong> </p> </br>`
      );

      res.render("myBookings", { bookings: bookingDetails });
    }
    // return successResponse(req, res, cancelBookingData, 200);
  } catch (error) {
    return errorResponse(req, res, "something went wrong", 400, { err: error });
  }
};

const addBookingView = async (req, res) => {
  try {
    let { tripId } = req.params;

    const tripData = await travelSchedule.findOne({ _id: tripId });
    res.render("addBooking", { trip: tripData });
  } catch (error) {
    return errorResponse(req, res, "something went wrong", 400, { err: error });
  }
};

module.exports = {
  addBooking,
  cancelBooking,
  viewBookingByUser,
  viewBookingByTrip,
  addBookingView,
};
