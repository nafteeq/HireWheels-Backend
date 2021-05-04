'use strict';

const userException = require('../tools/userException')
const userErrors = require("../constants/errors").userErrors
const fuelTypeModel = require("../models/fuelType")
const locationModel = require("../models/location")
const vehicleSubCategoryModel = require("../models/vehicleSubCategory")
const vehicleModelDB = require("../models/vehicle")
const bookingModel = require("../models/booking")
const aggregations = require("../tools/aggregations")
const mongoose = require('mongoose')

async function addVehicle(vehicleModel, vehicleNumber, vehicleSubCategoryId, color, fuelTypeId, locationId, carImageUrl, availabilityStatus){

    try {

        // Reference
        let fuelData
        let locationData
        let vehicleSubCategoryData
        let vehicleExistingData
        let dbpayload

        // Get Fuel Data
        fuelData = await fuelTypeModel.FuelTypeModel.findOne({_id:fuelTypeId})
        if (fuelData == null) throw new userException(userErrors.invalidFuelId)

        // Get Location Data
        locationData = await locationModel.LocationModel.findOne({_id:locationId})
        if (locationData == null) throw new userException(userErrors.invalidLocationId)

        // Get Vehicle Sub Category Data
        vehicleSubCategoryData = await vehicleSubCategoryModel.VehicleSubCategoryModel.findOne({_id:vehicleSubCategoryId})
        if (vehicleSubCategoryData == null) throw new userException(userErrors.invalidVehicleSubCategoryId)

        // Check if Vehicle Number Already Exists
        vehicleExistingData = await vehicleModelDB.VehicleModel.findOne({vehicleNumber})
        if (vehicleExistingData != null) throw new userException(userErrors.vehicleNumberAlreadyExists)

        // DB payload
        dbpayload = { vehicleModel, vehicleNumber, vehicleSubCategoryId, color, fuelTypeId, locationId, carImageUrl, availabilityStatus}

        // Save in DB
        await vehicleModelDB.VehicleModel.create([dbpayload])

        return true

    } catch (error) {
        throw error
    }

}

async function updateAvailability(vehicleId, availabilityStatus){

    try {

        // Reference
        let vehicleData

        // Get Vehicle Data
        vehicleData = await vehicleModelDB.VehicleModel.findOne({_id:vehicleId})
        if (vehicleData == null) throw new userException(userErrors.vehicleNotFound)

        // Update
        vehicleData.availabilityStatus = availabilityStatus
        await vehicleData.save()

        return true

    } catch (error) {
        throw error
    }

}


async function getVehicles(categoryName, pickUpDate, dropOffDate, locationId){

    try {

        // Reference
        let vehicleData
        let vehicleIds
        let filters = {}
        let todayDate = new Date(new Date().toISOString().slice(0,10))
        let locationData
        let bookingData
        let bookedVehicleIds = []
        let availableVehicles = []

        // Date Formatting
        pickUpDate = new Date(pickUpDate)
        dropOffDate = new Date(dropOffDate)

        // Check that Pickup Date should not be less than Today
        if (pickUpDate.getTime() < todayDate.getTime()) throw new userException(userErrors.invalidPickUpDate)

        // Check DropDate should be greater than today's date and greater than PickUp Date
        if (dropOffDate.getTime() < todayDate.getTime()) throw new userException(userErrors.invalidDropOffDate)
        if (dropOffDate.getTime() < pickUpDate.getTime()) throw new userException(userErrors.invalidDropOffDate)

        // Get Location Data
        locationData = await locationModel.LocationModel.findOne({_id:locationId})
        if (locationData == null) throw new userException(userErrors.invalidLocationId)

        // Create Filters
        filters.availabilityStatus = 1
        filters.locationId = mongoose.Types.ObjectId(locationId)

        // Get Vehicle Data
        vehicleData = await vehicleModelDB.VehicleModel.aggregate(aggregations.getAvailableVehiclePipeline(filters, categoryName, pickUpDate, dropOffDate))
        vehicleIds = vehicleData.map(x=>x._id.toString())

        // Get all Booking Data
        bookingData = await bookingModel.BookingModel.find({vehicleId : {"$in" : vehicleIds}})

        /**
         *  Get a list of all the vehicle Ids which have booking during input booking slot.
         *  A vehicle is unavailable for booking if any of the following three scenarios are met-
         *
         *  a. booking pick up date > Booked Vehicle's pickup date &&
         *  booking pick up date < Booked Vehicle's dropoff date
         *
         *  b. booking drop off date > Booked Vehicle's pickup date &&
         *  booking drop off date < Booked Vehicle's dropoff date
         *
         *  c. booking pickup date < Booked vehicle's pick up date &&
         *  booking drop off date > Booked vehicle's drop off date
         *
         * Apart from this, we also need to consider those vehicles as booked if booking pick or dropoff date
         * equals to either booked vehicle's pickup date or dropoff date.
         *
         */
        bookingData.forEach(booking => {

            if(
                (pickUpDate.getTime() > booking.pickUpDate.getTime() && pickUpDate.getTime() < booking.dropOffDate.getTime())
                ||
                (dropOffDate.getTime() > booking.pickUpDate.getTime() && dropOffDate.getTime() < booking.dropOffDate.getTime())
                ||
                (pickUpDate.getTime() < booking.pickUpDate.getTime() && dropOffDate.getTime() > booking.dropOffDate.getTime())
                ||
                (pickUpDate.getTime() == booking.dropOffDate.getTime())
                ||
                (dropOffDate.getTime() == booking.pickUpDate.getTime())
                ||
                (pickUpDate.getTime() == booking.pickUpDate.getTime())
                ||
                (dropOffDate.getTime() == booking.dropOffDate.getTime())
            ){
                bookedVehicleIds.push(booking.vehicleId.toString())
            }
        })
        /**
         * Filter out those vehicles from the returnedVehicleList
         * which are already booked in the booking slot.
         */
        vehicleData.forEach(vehicle => {
            if(bookedVehicleIds.indexOf(vehicle._id.toString()) == -1){
                availableVehicles.push({
                    "vehicleId": vehicle._id.toString(),
                    "vehicleModel": vehicle.vehicleModel,
                    "vehicleNumber": vehicle.vehicleNumber,
                    "vehicleSubCategoryId": vehicle.vehicleSubCategoryId,
                    "color": vehicle.color,
                    "fuelTypeId": vehicle.fuelTypeId,
                    "locationId": vehicle.locationId,
                    "carImageUrl": vehicle.carImageUrl,
                    "availability_status": vehicle.availabilityStatus,
                    "pricePerDay": vehicle.vehicleSubCategoryData.pricePerDay
                })
            }
        })

        return availableVehicles

    } catch (error) {
        throw error
    }

}


async function getAllVehicles(){

    try {

        // Reference
        let vehicleData
        let response = []

        // Get Vehicle Data
        vehicleData = await vehicleModelDB.VehicleModel.find({})

        // Fix Columns
        vehicleData.forEach(vehicle => {
            vehicle = vehicle.toObject()
            vehicle["vehicleId"] = vehicle._id.toString()
            vehicle["availability_status"] = vehicle.availabilityStatus
            response.push(vehicle)
        })

        return response

    } catch (error) {
        throw error
    }

}

module.exports = {
    addVehicle,
    updateAvailability,
    getVehicles,
    getAllVehicles
}