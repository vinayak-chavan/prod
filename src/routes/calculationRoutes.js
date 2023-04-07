const express = require("express");
const { viewCalculation, addCalculation, calculationView, searchCalculation } = require('../controllers/calculation.controller');
const { rawMaterialUpdate, viewRawMaterial, addRawMaterial, rawMaterialListAdd } = require('../controllers/material.controller');
const { viewProduction, addProduction, viewProductionPerWeek, productionView, searchProduction } = require('../controllers/production.controller');

const { auth } = require("../middlewares/auth");

const route = express.Router();

route.get("/calculationView", auth, calculationView);
route.get("/calculationSearch", auth, searchCalculation);
route.post("/calculationDay", auth, viewCalculation);
route.post("/calculation", auth, addCalculation);

route.get("/material", auth, viewRawMaterial);
route.post("/material", auth, addRawMaterial);
route.get("/rawMaterialAddView", auth, rawMaterialListAdd);
route.post("/rawMaterialListAdd", auth, rawMaterialUpdate);

route.get("/productionView", auth, productionView);
route.get("/searchProduction", auth, searchProduction);
route.post("/productionPerDay", auth, viewProduction);
route.post("/productions", auth, addProduction);
route.get("/week", auth, viewProductionPerWeek);

module.exports = route;