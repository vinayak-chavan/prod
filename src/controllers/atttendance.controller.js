const moment = require('moment');
const attedance = require('../models/attendance');
const user = require('../models/user');
const review = require('../models/review');
const { successResponse, errorResponse } = require("../utils/index");
let company;

const viewAttendance = async (req, res) => {
  try {
    let userId = req.user._id;
    let month = req.body.month;
    let year = req.body.year;

    const result = await attedance.find({ month: month, year: year, userId: userId });
    console.log(result);
    let array = [];
    for(let i = 0; i< result.length; i++) {
        array = array.concat(result[i].employeeName);
    }

    let countObj = {};

    let countFunc = keys => {
      countObj[keys] = ++countObj[keys] || 1;
    }
    array.forEach(countFunc);
    console.log('final-->', countObj)

    res.render("viewAttendance", { users: countObj });
    // res.send(countObj);
  } catch (error) {
    return errorResponse(req, res, 'something went wrong', 400, { err: error });
  }
};


const addAttendance = async (req, res) => {
  try {

    let userId = req.user._id;
    let today = req.body.date;
    let tempDateArray = today.split("-");
    let month = parseInt(tempDateArray[1]);
    let year = parseInt(tempDateArray[0]);
    let employeeName = req.body.employeeName;
    
    let strArray = employeeName.split(',');
    let newArray = [];
    strArray.forEach((key) => {
        newArray.push(key.replace( /[\r\n]+/gm, "" ).toLowerCase().trim());
    });
    console.log(newArray);

    const newAttandance = new attedance({
            userId: userId,
            date: today,
            month: month,
            year: year,
            employeeName: newArray,
    });

    let result = await newAttandance.save();
      
    console.log(result);
    res.render("addAttendance");
  } catch (error) {
    console.log(error.message);
    return errorResponse(req, res, 'something went wrong', 500, { err: error });
  }
};

const addReview = async (req, res) => {
  try {
    let companyId = company;
	  console.log(companyId);
    let text = req.body.text;
    let sender = req.user._id;

    const newReview = new review({
      userId: companyId,
      sender: sender,
      text: text,      
    });

    let result = await newReview.save();
      
    res.redirect('/companies');
  } catch (error) {
    console.log(error.message);
    return errorResponse(req, res, 'something went wrong', 500, { err: error });
  }
};

const viewReviewsByOwn = async (req, res) => {
  try {
    let id = req.user._id;
    const result = await review.find({ userId: id }).populate('sender');;
    res.render("viewOwnReviews", { exams: result });
  } catch (error) {
    console.log(error.message);
    return errorResponse(req, res, 'something went wrong', 500, { err: error });
  }
};

const viewReviewsByOthers = async (req, res) => {
  try {
    let userId = req.params.id;
    const result = await review.find({ userId : userId }).populate('sender');
    res.render("viewReview", { exams: result });
  } catch (error) {
    console.log(error.message);
    return errorResponse(req, res, 'something went wrong', 500, { err: error });
  }
};

const addReviewView = async (req, res) => {
  company = req.params.id;
  res.render("addReview");
}

const addAttendanceView = async (req, res) => {
  res.render("addAttendance");
}

const searchAttendance = async (req, res) => {
  res.render("searchAttendanceView");
}

module.exports = { viewAttendance, addAttendance, addReview, addAttendanceView, viewReviewsByOwn, searchAttendance, viewReviewsByOthers, addReviewView };