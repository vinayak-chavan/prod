const joi = require("joi");
const { errorResponse } = require("../../utils/index");

const validation = joi.object({
  startingPoint: joi.string().min(3).max(15).trim(true).required(),
  destinationPoint: joi.string().min(3).max(15).required(),
  travelDate: joi.string().required(),
  departureTime: joi.string().trim(true).required(),
  reachTime: joi.string().trim(true).required(),
  fareAmount: joi.required(),
});

const tripValidation = async (req, res, next) => {
  const payload = {
    startingPoint: req.body.startingPoint,
    destinationPoint: req.body.destinationPoint,
    travelDate: req.body.travelDate,
    departureTime: req.body.departureTime,
    reachTime: req.body.reachTime,
    fareAmount: req.body.fareAmount,
  };

  const { error } = validation.validate(payload);
  if (error) {
    console.log(error.message);
    return errorResponse(req, res, "please enter valid data", 400);
  } else {
    next();
  }
};

module.exports = { tripValidation };
