const MongoDB = require('../db/mongo.js');
const authController = require("../controller/auth")
const cityModel = require("../models/city")
const fuelTypeModel = require("../models/fuelType")
const vehicleCategoryModel = require("../models/vehicleCategory")
const vehicleSubCategoryModel = require("../models/vehicleSubCategory")
const locationModel = require("../models/location")
const refStrings = require("../constants/refStrings")

async function main(firstName, lastName, email, password, mobileNo){

    try {

        // Reference
        let frontendHardCodeData = {}

        await MongoDB.connectDB().
        then((newDB) => {
            console.log("DB : Db connected")
            console.log("System Initialization completed")
        }).
        catch((err) => {
            console.error(err)
            console.error("DB : Connection error. Stopping")
        })

        // Add Admin User
        await authController.signUp(firstName, lastName, email, password, mobileNo, refStrings.admin)
        console.log("Admin Added")
        frontendHardCodeData.admin = {
            email : email,
            password: password
        }

        // Add City
        let cityPayload = {
            cityName : "Mumbai"
        }
        let cityData = await cityModel.CityModel.create([cityPayload])
        cityData = cityData[0]
        console.log("City Added")
        frontendHardCodeData.city = {
            id: cityData._id,
            name: "Mumbai",
        }

        // Add Location
        let locationPayload = [
            {
                "locationName": "Worli",
                "address": "Dr E Moses Rd, Worli Naka, Upper Worli",
                "pincode": 400018,
                "cityId": cityData._id
            },
            {
                "locationName": "Chembur",
                "address": "Optic Complex",
                "pincode": 400019,
                "cityId": cityData._id
            },
            {
                "locationName": "Powai",
                "address": "Hiranandani Tower",
                "pincode": 400020,
                "cityId": cityData._id
            }

        ]
        await locationModel.LocationModel.insertMany(locationPayload)
        console.log("Location Added")
        frontendHardCodeData.location = await locationModel.LocationModel.find({},{id:1, locationName:1})

        // Add Fuel Type
        let fuelTypePayload = [
            {
                "fuelType": "Petrol",
            },
            {
                "fuelType": "Diesel",
            }
        ]
        await fuelTypeModel.FuelTypeModel.insertMany(fuelTypePayload)
        console.log("Fuel Type Added")
        frontendHardCodeData.fuel = await fuelTypeModel.FuelTypeModel.find({},{id:1, fuelType:1})

        // Add Vehicle Category
        let vehicleCategoryPayload = [
            {
                vehicleCategoryName : "CAR"
            },
            {
                vehicleCategoryName : "BIKE"
            }
        ]
        await vehicleCategoryModel.VehicleCategoryModel.insertMany(vehicleCategoryPayload)
        console.log("Vehicle Category Added")
        frontendHardCodeData.vehicleCatgory = await vehicleCategoryModel.VehicleCategoryModel.find({},{id:1, vehicleCategoryName:1})

        // Add Vehicle SubCategory
        let vehicleCategoryBikeId = (await vehicleCategoryModel.VehicleCategoryModel.findOne({vehicleCategoryName : "BIKE"}))._id
        let vehicleCategoryCarId= (await vehicleCategoryModel.VehicleCategoryModel.findOne({vehicleCategoryName : "CAR"}))._id
        let vehicleSubCategoryPayload = [
            {
                vehicleSubCategoryName : "SUV",
                pricePerDay : 300,
                vehicleCategoryId : vehicleCategoryCarId
            },
            {
                vehicleSubCategoryName : "SEDAN",
                pricePerDay : 350,
                vehicleCategoryId : vehicleCategoryCarId
            },
            {
                vehicleSubCategoryName : "HATCHBACK",
                pricePerDay : 250,
                vehicleCategoryId : vehicleCategoryCarId
            },
            {
                vehicleSubCategoryName : "CRUISER",
                pricePerDay : 200,
                vehicleCategoryId : vehicleCategoryBikeId
            },
            {
                vehicleSubCategoryName : "DIRT BIKE",
                pricePerDay : 200,
                vehicleCategoryId : vehicleCategoryBikeId
            },
            {
                vehicleSubCategoryName : "SPORTS BIKE",
                pricePerDay : 150,
                vehicleCategoryId : vehicleCategoryBikeId
            },

        ]
        await vehicleSubCategoryModel.VehicleSubCategoryModel.insertMany(vehicleSubCategoryPayload)
        console.log("Vehicle Sub Category Added")
        frontendHardCodeData.vehicleSubCategory = await vehicleSubCategoryModel.VehicleSubCategoryModel.find({},{id:1, vehicleSubCategoryName:1})

        console.log("Success")
        console.log("HardCoded Data")
        console.log(frontendHardCodeData)
        process.exit(0);

    } catch (error) {
        console.error(error)
        process.exit(1);
    }

}

let firstName = "Jitender"
let lastName = "Bhutani"
let email = "upgrad@gmail.com"
let password = "admin@123"
let mobileNo = "123456789"
main(firstName, lastName, email, password, mobileNo)