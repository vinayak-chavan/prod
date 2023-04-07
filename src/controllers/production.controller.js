const user = require("./../models/user");
const production = require("./../models/production");
const { successResponse, errorResponse } = require("../utils/index");

const addProduction = async (req, res) => {
  try {
    let userId = req.user._id;
    console.log(userId);
    let todayProduction = req.body;
    
    let currentDate = req.body.date;
    let current = new Date(currentDate);
    let startDate = new Date(current.getFullYear(), 0, 1);
    let days = Math.floor((current - startDate) / (24 * 60 * 60 * 1000));
         
    let weekNumber = Math.ceil(days / 7);

    delete todayProduction.date;
    
    let isExist = await production.findOne({userId: userId, currentDate: currentDate});
    console.log(isExist);
    if(!isExist) {
      const newProduction = new production({
        userId,
        todayProduction,
        currentDate,
        weekNumber
      });

      let result = await newProduction.save();
      console.log(result);
      console.log("production inserted");
      res.redirect('/searchProduction');
    }
  } catch (error) {
    console.log(error.message);
    return errorResponse(req, res, 'something went wrong', 500, { err: error });
  }
};

const viewProduction = async (req, res) => {
  try {
    let userId = req.user._id;
    let currentDate = req.body.date;
    console.log(currentDate);
    const result = await production.findOne({ userId: userId, currentDate, currentDate });
    console.log(result);
    res.render("viewProductionPerDay", {users: result});
  } catch (error) {
    console.log(error.message);
    return errorResponse(req, res, 'something went wrong', 500, { err: error });
  }
};

const productionView = async (req, res) => {
  try{
    let products = req.user.products;
    let productArray = products.split(',');
    res.render("addProduction", { product: productArray });
  } catch (error) {
    console.log(error.message);
    return errorResponse(req, res, 'something went wrong', 500, { err: error });
  }
};

const searchProduction = async (req, res) => {
  res.render("searchProduction");
};

const viewProductionPerWeek = async (req, res) => {
  try {

	function predict(result) {
		let obj = {}, j=0;
		result.forEach(ke => {
	
			Object.keys(ke).forEach(key => {
				if(!obj.hasOwnProperty(key)) {
					obj[key] = ke[key];
				} else {
					let temp = obj[key];
					obj[key]= temp + ke[key];	
				}
			});
		});

		delete obj._id;
		Object.keys(obj).forEach(key => {
			obj[key] = Math.floor(obj[key]/result.length);
		});
		return obj;
	}

    let userId = req.user._id;
    
    let result = await production.aggregate( [ { $match : { userId : userId } }, {
    '$group': {
      '_id': '$weekNumber', 
      'todayProduction': {
        '$push': '$todayProduction'
      }
    }}]);
    
	
    let array = [];
    let re = [];
	let j = 0;
	
    result.forEach(key => {

		array = key.todayProduction;
		let obj ={};
		
		for(let i=0; i<array.length; i++) {

			let n = array[i]
			Object.keys(n).forEach(key => {
				n[key]= Number(n[key]);
				
				if(!obj.hasOwnProperty(key)) {
					
					obj[key] = n[key];
				} else {
					
					let temp = obj[key];
					obj[key]= temp + n[key];
					
				}
			});
		}
		delete key.todayProduction;
		re[j] = Object.assign(key,obj);
		j++;
	});

	let answer = predict(re);
	answer._id= "Estimation";
	re.push(answer);
	console.log(re);
	res.render('productionPerWeek', {users: re});
    // res.send(result);
  } catch (error) {
    console.log(error.message);
    return errorResponse(req, res, 'something went wrong', 500, { err: error });
  }
};

module.exports = { viewProduction, addProduction, viewProductionPerWeek, productionView, searchProduction };