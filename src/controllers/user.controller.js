const bcrypt = require("bcryptjs");
const user = require("./../models/user");
const { successResponse, errorResponse } = require("../utils/index");

const login = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    // check for email exist or not
    const userData = await user.findOne({ email: email, });
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
        secret: "secret",
      });
      console.log(accessToken);
      res.cookie("accessToken", accessToken);
      await userData.save();

      if(userData.city === "")
      res.redirect("/profile");
      else
      res.redirect("/companies");
    }
  } catch (error) {
    console.log(error.message);
    return errorResponse(req, res, "something went wrong!", 400, {
      err: error,
    });
  }
};

const register = async (req, res) => {
  try {
    const { name, email, password } = new user(req.body);

    // check if email id allready exist
    const userData = await user.findOne({ email: email });

    if (userData) {
      return errorResponse(req, res, "email id allready exist", 400);
    } else {
      // creating payload
      const payload = {
        name,
        email,
        password,
      };

      // register new user
      const newUser = new user(payload);
      const insertUser = await newUser.save();

      console.log("Registration Successful");
      res.render("login");
      // return successResponse(req, res, insertUser, 200);
    }
  } catch (error) {
    console.log(error.message)
    return errorResponse(req, res, "something went wrong", 400);
  }
};

const loginView = async (req, res) => {
  res.render("login");
};

const logout = async (req, res) => {
  try {
    res.clearCookie("accessToken");
    return res.redirect("/");
  } catch (error) {
    return errorResponse(req, res, "Error while logging out", 500);
  }
};

const updateCompany = async (req, res) => {
    try {
        let userId = req.user._id;

        const companyDetails = await user.findByIdAndUpdate(userId, {
            name: req.body.name,
            email: req.body.email,
            phoneNumber: req.body.phoneNumber,
            address: req.body.address,
            city: req.body.city,
            state: req.body.state,
            products: req.body.products,
            photo: req.file.filename
        });
        console.log(req.file.filename);
        res.redirect('/profile');
    } catch (e) {
        res.status(400).send(e);
    }
};

const viewProfile = async (req, res) => {
  try {
      let userId = req.user._id;
      const myProfile = await user.findOne({ _id: userId });
      res.render("myProfile", { users: myProfile });
    } catch (e) {
      res.status(400).send(e);
    
  }
};

const viewAllCompany = async (req, res) => {
  try {
    let userId = req.user._id;
    const details = await user.find({ _id: { $ne: userId } });
    res.render("viewCompanies", { users: details });
  } catch (e) {
    res.status(400).send(e);
  }
};

const viewCompanyDetails = async (req, res) => {
  try {
    let id = req.params.id;
    const details = await user.findOne({ _id: id });
    console.log(details);
    res.render("viewCompanyDetails", { users: details });
  } catch (e) {
    res.status(400).send(e);
  }
};

module.exports = {
  login,
  register,
  logout,
  loginView,
  viewProfile,
  updateCompany,
  viewAllCompany,
  viewCompanyDetails,
};
