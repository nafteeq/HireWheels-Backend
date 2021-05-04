'use strict';

const util = require("../tools/util")
const apiLogger = require("../tools/logging").apiLogger
const vehicleController = require("../controller/vehicle")
const validationError = require("../constants/errors").validationError
const apiValidators = require("../tools/apiValidators")
const refStrings = require("../constants/refStrings")


async function addVehicle(req, res){

    try{

        // Reference
        let validate
        let response
        let vehicleModel
        let vehicleNumber
        let vehicleSubCategoryId
        let color
        let fuelTypeId
        let locationId
        let carImageUrl
        let availabilityStatus

        // Log Request
        await apiLogger.logRequest(req)

        // Validate Request
        validate = apiValidators.addVehicle(req.body)
        if (!validate.valid) validationError(validate.errors)

        // Get Required Params
        vehicleModel = req.body.vehicleModel
        vehicleNumber = req.body.vehicleNumber
        vehicleSubCategoryId = req.body.vehicleSubCategoryId
        color = req.body.color
        fuelTypeId = req.body.fuelTypeId
        locationId = req.body.locationId
        carImageUrl = req.body.carImageUrl
        availabilityStatus = req.body.availability_status

        // Business Logic
        await vehicleController.addVehicle(vehicleModel, vehicleNumber, vehicleSubCategoryId, color, fuelTypeId, locationId, carImageUrl, availabilityStatus)

        // Response
        response = await util.customResponse(refStrings.vehicleAddedSuccessfully, 200)

        // Log Response
        apiLogger.logResponse(response)

        // Send Response
        res.status(200).send(response)

    }
    catch(exception){
        await util.handleErrorResponse(exception, res)
    }

}


async function updateAvailability(req, res){

    try{

        // Reference
        let validate
        let response
        let vehicleId
        let availabilityStatus

        // Log Request
        await apiLogger.logRequest(req)

        // Validate Request
        req.body.vehicleId = req.params.vehicleId
        validate = apiValidators.updateAvailability(req.body)
        if (!validate.valid) validationError(validate.errors)

        // Get Required Params
        vehicleId = req.params.vehicleId
        availabilityStatus = req.body.availability_status

        // Business Logic
        await vehicleController.updateAvailability(vehicleId, availabilityStatus)

        // Response
        response = await util.customResponse(refStrings.activityPerformedSuccessfully, 200)

        // Log Response
        apiLogger.logResponse(response)

        // Send Response
        res.status(200).send(response)

    }
    catch(exception){
        await util.handleErrorResponse(exception, res)
    }

}


async function getVehicles(req, res){

    try{

        // Reference
        let validate
        let response
        let categoryName
        let pickUpDate
        let dropDate
        let locationId
        let validationParams

        // Log Request
        await apiLogger.logRequest(req)

        // Get Required Params
        categoryName = req.query.categoryName
        pickUpDate = req.query.pickUpDate
        dropDate = req.query.dropDate
        locationId = req.query.locationId

        // Validate Request
        validationParams = {categoryName, pickUpDate, dropDate, locationId}
        validate = apiValidators.getVehicles(validationParams)
        if (!validate.valid) validationError(validate.errors)

        // Business Logic
        response = await vehicleController.getVehicles(categoryName, pickUpDate, dropDate, locationId)

        // Log Response
        apiLogger.logResponse(response)

        // Send Response
        res.status(200).send(response)

    }
    catch(exception){
        await util.handleErrorResponse(exception, res)
    }

}

async function getAllVehicles(req, res){

    try{

        // Reference
        let response

        // Log Request
        await apiLogger.logRequest(req)

        // Business Logic
        response = await vehicleController.getAllVehicles()

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
    addVehicle,
    updateAvailability,
    getVehicles,
    getAllVehicles
}