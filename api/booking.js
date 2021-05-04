'use strict';

const util = require("../tools/util")
const apiLogger = require("../tools/logging").apiLogger
const bookingController = require("../controller/booking")
const validationError = require("../constants/errors").validationError
const apiValidators = require("../tools/apiValidators")

async function bookVehicle(req, res){

    try{

        // Reference
        let validate
        let response
        let vehicleId
        let pickupDate
        let dropOffDate
        let bookingDate
        let locationId
        let amount
        let userId

        // Log Request
        await apiLogger.logRequest(req)

        // Validate Request
        validate = apiValidators.bookVehicle(req.body)
        if (!validate.valid) validationError(validate.errors)

        // Get Required Params
        vehicleId = req.body.vehicleId
        pickupDate = req.body.pickupDate
        dropOffDate = req.body.dropoffDate
        bookingDate = req.body.bookingDate
        amount = req.body.amount
        locationId = req.body.locationId
        userId = req.auth.userId

        // Business Logic
        response = await bookingController.bookVehicle(userId, vehicleId, pickupDate, dropOffDate, bookingDate, amount, locationId)

        // Log Response
        apiLogger.logResponse(response)

        // Send Response
        res.status(200).send(response)

    }
    catch(exception){
        await util.handleErrorResponse(exception, res)
    }

}


module.exports = {
    bookVehicle
}