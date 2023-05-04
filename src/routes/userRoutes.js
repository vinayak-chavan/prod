const express = require("express");
const {
  login,
  register,
  logout,
  loginView,
  viewProfile,
  updateCompany,
  viewAllCompany,
  viewCompanyDetails,
} = require("../controllers/user.controller");
const { auth } = require("../middlewares/auth");
const upload = require('./../middlewares/upload');
const router = express.Router();

router.get('/', loginView);
router.post('/login', login);
router.post('/register', register);
router.get('/logout', auth, logout);
// router.post('/test', upload.single("photo"), test);

// router.post("/profile", auth, uploadFunction, updateCompany);
router.post("/profile", auth, upload.single("photo"), updateCompany);
router.get("/profile", auth, viewProfile);

router.get("/companies", auth, viewAllCompany);
router.get("/company/:id", auth, viewCompanyDetails);

module.exports = router;
