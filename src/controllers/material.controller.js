const user = require('../models/user');
const material = require('../models/rowMaterial');
const { successResponse, errorResponse } = require("../utils/index");

const addRawMaterial = async (req, res) => {
  try {
    let userId = req.user._id;
    delete req.body.city;
    let rowMaterial = req.body;
    const updateMaterial = await material.findOne({userId: userId});
    updateMaterial.rowMaterial = rowMaterial;
    let result =await updateMaterial.save();
  
    console.log(result);
    res.redirect('/material');
  } catch (error) {
    console.log(error.message);
    return errorResponse(req, res, 'something went wrong', 500, { err: error });
  }
};

const viewRawMaterial = async (req, res) => {
  try {
    let userId = req.user._id;
    const result = await material.findOne({ userId: userId });
    console.log(result);
    res.render("updateMaterial", {user: result});
  } catch (error) {
    console.log(error.message);
    return errorResponse(req, res, 'something went wrong', 500, { err: error });
  }
};

const rawMaterialListAdd = async(req, res) =>{
  try {
    let userId = req.user._id;
    console.log({user: userId});
    let materialObject = await material.findOne({userId: userId});

    if(!materialObject) {
        materialObject = {
          rowMaterialList : []       
        };
    }
    res.render("addRawMaterial", {user: materialObject});

  } catch (error) {
    console.log(error.message);
    return errorResponse(req, res, 'something went wrong', 500, { err: error });
  }
};

const rawMaterialUpdate = async(req, res) => {
  try {
    let _id = req.user._id;
    let material1 = req.body.rawMaterial;
    let strArray = material1.split(',');
    let newArray = [];
    strArray.forEach((key) => {
        newArray.push(key.replace( /[\r\n]+/gm, "" ).toLowerCase().trim());
    });
    console.log(newArray);
    
    const materialObject = await material.findOne({userId: _id});
    let rowMaterialObj={};
    newArray.forEach(key => {
      rowMaterialObj[key] = 0;
    });
    console.log('rowMaterialObj-->',  rowMaterialObj)
    if(!materialObject) {
      const newBlog = new material({
            userId: _id,
            rowMaterialList: newArray,
            rowMaterial: rowMaterialObj,
        });
        let re = await newBlog.save();
        console.log(re);
    } else {
      let temp = await material.findOne({userId: _id});
      temp.rowMaterialList = newArray;
      temp.save();
    }

    res.redirect('/material');
  } catch (error) {
    console.log(error.message);
    return errorResponse(req, res, 'something went wrong', 500, { err: error });
  }
};

module.exports = { rawMaterialUpdate, viewRawMaterial, addRawMaterial, rawMaterialListAdd };