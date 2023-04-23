const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const user = require("../../models/user");
const { successResponse, errorResponse } = require("../../utils");

const login = async (req, res) => {
  try {
    const emailID = req.body.emailID;
    const password = req.body.password;

    // check for email exist or not
    const userData = await user.findOne({ emailID: emailID });
    if (!userData) {
      return errorResponse(req, res, "Invalid credentials!", 404);
    }

    // check for the password
    const isMatch = await bcrypt.compare(password, userData.password);

    if (!isMatch) {
      res.render("login");

      // return errorResponse(req, res, 'Invalid credentials!', 404);
    } else {
      // jwt token created
      let accessToken = userData.getToken({
        exp: 60 * 60,
        secret: process.env.ACCESS_TOKEN_SECRET,
      });

      res.cookie("accessToken", accessToken);
      res.send(accessToken);
      // await userData.save();

      // if (userData.role === "admin") res.redirect("/bus");
      // else res.render("search");
      // return successResponse(req, res, accessToken, 200);
    }
  } catch (error) {
    return errorResponse(req, res, "something went wrong!", 400, {
      err: error,
    });
  }
};

const register = async (req, res) => {
  try {
    const { username, phoneno, emailID, password } = new user(req.body);

    // check if email id allready exist
    const userData = await user.findOne({ emailID: emailID });

    if (userData) {
      return errorResponse(req, res, "email id allready exist", 400);
    } else {
      // creating payload
      const payload = {
        username,
        phoneno,
        emailID,
        password,
        wallet: 3000,
        role: "user",
      };

      // register new user
      const newUser = new user(payload);
      const insertUser = await newUser.save();

      console.log("Registration Successful");
      res.render("login");
      // return successResponse(req, res, insertUser, 200);
    }
  } catch (error) {
    return errorResponse(req, res, "something went wrong", 400);
  }
};

const loginView = async (req, res) => {
  res.render("login");
};

const viewProfile = async (req, res) => {
  try {
    const id = req.user._id;
    const userData = await user.findOne({ _id: id });

    // check if data is exist or not
    if (!userData) {
      return errorResponse(req, res, "User Not Found", 404);
    } else {
      res.render("userProfile", { users: userData });
      // return successResponse(req, res, userData, 200);
    }
  } catch (error) {
    return errorResponse(req, res, "something went wrong", 400);
  }
};

const updateProfile = async (req, res) => {
  try {
    let userId = req.params.id;

    // updating user details
    const updateDetails = await user.findByIdAndUpdate(userId, {
      username: req.body.username,
      phoneno: req.body.phoneno,
    });

    const userData = await user.findOne({ _id: userId });

    if (!userData) {
      return errorResponse(req, res, "User Not Found", 404);
    } else {
      res.render("userProfile", { users: userData });
      // return successResponse(req, res, userData, 200);
    }
  } catch (error) {
    return errorResponse(req, res, "something went wrong", 400);
  }
};

const searchView = async (req, res) => {
  res.render("search");
};

const viewUserByAdmin = async (req, res) => {
  try {
    let role = "user";
    const userData = await user.find({ role: role });

    // check if data is exist or not
    if (!userData) {
      return errorResponse(req, res, "Users Not Found", 404);
    } else {
      res.render("viewUsers", { users: userData });
      // return successResponse(req, res, userData, 200);
    }
  } catch (error) {
    return errorResponse(req, res, "something went wrong", 400);
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie("accessToken");
    return res.redirect("/");
  } catch (error) {
    return errorResponse(req, res, "Error while logging out", 500);
  }
};

module.exports = {
  login,
  register,
  logout,
  loginView,
  searchView,
  viewProfile,
  updateProfile,
  viewUserByAdmin,
};
