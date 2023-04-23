const express = require("express");
const { auth } = require('../middlewares/auth');
const { userValidation } = require("../controllers/user/user.validation");
const { isAdmin } = require("../middlewares/isAdmin");

const {
  login,
  register,
  logout,
  loginView,
  viewProfile,
  updateProfile,
  searchView,
  viewUserByAdmin,
} = require("../controllers/user/user.controller");

const route = express.Router();

route.get('/', loginView);
route.post('/login', login);
route.post('/register', userValidation, register);
route.get('/logout', logout);
route.get('/profile', auth, viewProfile);
route.post('/profile/:id', auth, updateProfile);
route.get("/users", auth, isAdmin, viewUserByAdmin);
route.get('/search', searchView);

module.exports = route;
