const joi = require("joi");
const { errorResponse } = require("../../utils/index");

const validation = joi.object({
  seats: joi.required(),
  totalAmount: joi.required(),
});

const bookingValidation = async (req, res, next) => {
  const payload = {
    seats: req.body.seats,
    totalAmount: req.body.totalAmount
  };

  const { error } = validation.validate(payload);
  if (error) {
    console.log(error.message);
    return errorResponse(req, res, "please enter valid data", 400);
  } else {
    next();
  }
};

module.exports = { bookingValidation };
