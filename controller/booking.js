'use strict';

const UserModel = require("../models/user").UserModel
const userException = require('../tools/userException')
const userErrors = require("../constants/errors").userErrors
const locationModel = require("../models/location")
const vehicleModelDB = require("../models/vehicle")
const bookingModel = require("../models/booking")
const userModel = require("../models/user")
const vehicleSubCategoryModel = require("../models/vehicleSubCategory")

async function bookVehicle(userId, vehicleId, pickUpDate, dropOffDate, bookingDate, amount, locationId){

    try {

        // Reference
        let bookingData
        let dbPayload
        let userData
        let vehicleData
        let vehicleSubCategoryData
        let locationData
        let walletMoney
        let todayDate = new Date(new Date().toISOString().slice(0,10))
        let oneDay = 24 * 60 * 60 * 1000;
        let existingBookingData

        // Date Formatting
        pickUpDate = new Date(pickUpDate)
        dropOffDate = new Date(dropOffDate)
        bookingDate = new Date(bookingDate)

        // Get Location Data
        locationData = await locationModel.LocationModel.findOne({_id:locationId})
        if (locationData == null) throw new userException(userErrors.invalidLocationId)

        // Get Vehicle Data
        vehicleData = await vehicleModelDB.VehicleModel.findOne({_id:vehicleId, locationId:locationId, availabilityStatus:1})
        if (vehicleData == null) throw new userException(userErrors.vehicleNotFound)

        // Get Vehicle Sub Category Data
        vehicleSubCategoryData = await vehicleSubCategoryModel.VehicleSubCategoryModel.findOne({_id:vehicleData.vehicleSubCategoryId})
        if (vehicleSubCategoryData == null) throw new userException(userErrors.invalidVehicleSubCategoryId)

        // Check if Booking date is todays date or not
        if (bookingDate.getTime() != todayDate.getTime()) throw new userException(userErrors.invalidBookingDate)

        // Check DropDate should be greater than today's date and greater than PickUp Date
        if (dropOffDate.getTime() < todayDate.getTime()) throw new userException(userErrors.invalidDropOffDate)
        if (dropOffDate.getTime() < pickUpDate.getTime()) throw new userException(userErrors.invalidDropOffDate)

        // Get all Booking Data
        existingBookingData = await bookingModel.BookingModel.find({vehicleId : vehicleData._id})

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
        existingBookingData.forEach(booking => {

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
                throw new userException(userErrors.vehicleAlreadyBooked)
            }
        })

        // Calculate Amount
        amount = (Math.round(Math.abs((dropOffDate - pickUpDate) / oneDay)) + 1) * vehicleSubCategoryData.pricePerDay

        // Check if amount is positive
        if (amount <= 0) throw new userException(userErrors.invalidAmount)

        // Get User Data
        userData = await userModel.UserModel.findOne({_id:userId})
        walletMoney = userData.walletMoney

        // Check Balance
        if (walletMoney < amount) throw new userException(userErrors.insufficientBalance)

        // Deduct Balance
        userData.walletMoney -= amount
        await userData.save()

        // Create DB Payload
        dbPayload = {
            userId : userId,
            vehicleId: vehicleId,
            locationId: locationId,
            pickUpDate: pickUpDate,
            dropOffDate: dropOffDate,
            amount: amount,
            bookingDate:bookingDate
        }

        // Save in DB
        bookingData = await bookingModel.BookingModel.create([dbPayload])
        bookingData = bookingData[0]

        return bookingData

    } catch (error) {
        throw error
    }

}

module.exports = {
    bookVehicle
}