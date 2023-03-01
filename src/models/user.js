const mongoose = require("mongoose");
const Schema = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema(
  {
    name: { 
      type: "String", 
      required: true 
    },
    email: { 
      type: "String",   
      unique: true, 
      required: true 
    },
    password: { 
      type: "String", 
      required: true 
    },
    photo: {
      type: "String",
      default: "https://cdn.pixabay.com/photo/2016/09/02/18/38/factory-1639990_960_720.jpg",
    },
    phoneNumber: {
      type: "string", 
      trim: true,
      default: '',
      required: false 
    },
    address: { 
      type: "string", 
      trim: true,
      default: '',
      required: false 
    },
    city: {
      type: "string", 
      trim: true,
      default: '',
      required: false
    },
    state: {
      type: "string", 
      trim: true,
      default: '',
      required: false
    },
    products: {
      type: "string", 
      trim: true,
      default: '',
      required: false 
    },
  }
);

userSchema.methods.getToken = function ({ exp, secret }) {
  let token;
  if (exp) {
    token = jwt.sign({ id: this._id }, secret, {
      // This time is in second
      expiresIn: exp,
    });
  } else {
    token = jwt.sign({ id: this._id }, secret);
  }

  return token;
};

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const user = new mongoose.model("user", userSchema);

module.exports = user;
