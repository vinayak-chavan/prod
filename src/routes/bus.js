const express = require('express');
const { busValidation } = require("../controllers/bus/bus.validation");
const { auth } = require("../middlewares/auth");
const { isAdmin } = require('../middlewares/isAdmin');

const {
  viewBus,
  addBusView,
  addBus,
  deleteBus,
} = require('../controllers/bus/bus.controller');

const route = express.Router();

route.get("/bus", auth, isAdmin, viewBus);
route.get("/addbus", auth, isAdmin, addBusView);
route.post('/bus', busValidation, auth, isAdmin, addBus);
route.get('/deletebus/:id', auth, isAdmin, deleteBus);

module.exports = route;