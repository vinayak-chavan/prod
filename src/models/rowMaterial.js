const mongoose = require('mongoose');
const Schema = require("mongoose");

const materialSchema = new mongoose.Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  rowMaterialList: {
    type: Array,
  },
  rowMaterial: {
    type: Object,
  }
});

const material = new mongoose.model('material', materialSchema);

module.exports = material;
