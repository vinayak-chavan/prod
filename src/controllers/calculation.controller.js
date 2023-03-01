const moment = require('moment');
const calculation = require('../models/calculation');
const User = require('../models/user');
const { successResponse, errorResponse } = require("../utils/index");

const addCalculation = async (req, res) => {
  try {

    let userId = req.user._id;
    let date = req.body.date;
    let labourInput = parseInt(req.body.labourInput);
    let materialInput = parseInt(req.body.materialInput);
    let capitalInput = parseInt(req.body.capitalInput);
    let energyInput = parseInt(req.body.energyInput);
    let totalOutput = parseInt(req.body.totalOutput);

    let labourProductivity = totalOutput/labourInput;
    let materialProductivity = totalOutput/materialInput;
    let capitalProductivity = totalOutput/capitalInput;
    let energyProductivity = totalOutput/energyInput;

    let totalInput = labourInput + materialInput + capitalInput + energyInput;
    let totalProductivity = totalOutput/totalInput;

    const newCalculation = new calculation({
      userId,
      date,
      totalOutput,
      labourInput,
      materialInput,
      capitalInput,
      energyInput,
      labourProductivity,
      materialProductivity,
      capitalProductivity,
      energyProductivity,
      totalProductivity
    });

    let result = await newCalculation.save();
    res.redirect('/calculationView');

  } catch (error) {
    console.log(error.message);
    return errorResponse(req, res, 'something went wrong', 500, { err: error });
  }
};

const viewCalculation = async (req, res) => {
  try {
    let userId = req.user._id;
    let date = req.body.date;
    const result = await calculation.findOne({ userId: userId, date: date });
    if(!result){
      let result = {
        date: date,
        totalOutput: "",
        labourInput: "",
        materialInput: "",
        capitalInput: "",
        energyInput: "",
        labourProductivity: "",
        materialProductivity: "",
        capitalProductivity: "",
        energyProductivity: "",
        totalProductivity: "",
      }
      res.render("calculationResult", {users: result});
    } else {
      
      res.render("calculationResult", {users: result});
    }
  } catch (error) {
    console.log(error.message);
    return errorResponse(req, res, 'something went wrong', 500, { err: error });
  }
};

const calculationView = async (req, res) => {
  res.render("addCalculation");
};

const searchCalculation = async (req, res) => {
  res.render("searchCalculation");
};

module.exports = { viewCalculation, addCalculation, searchCalculation, calculationView };