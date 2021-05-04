'use strict';

const validate = require('jsonschema').validate
const enums = require("../constants/enums")
const util = require("../tools/util")
const userException = require('../tools/userException')
const userErrors = require("../constants/errors").userErrors

const signUp = (reqBody) => {
    return validate(reqBody, {
        "additionalProperties": false,
        "type": "object",
        "properties": {
            "firstName": { "type": "string", "required": true },
            "lastName": { "type": "string", "required": true },
            "email": { "type": "string", "required": true },
            "password": { "type": "string", "required": true },
            "mobileNo": { "type": "string", "required": true }
        }
    })
}

const login = (reqBody) => {
    return validate(reqBody, {
        "additionalProperties": false,
        "type": "object",
        "properties": {
            "email": { "type": "string", "required": true },
            "password": { "type": "string", "required": true }
        }
    })
}

const addVehicle = (reqBody) => {

    // Mongo ID Validation
    if (!util.isMongoIdStringValid(reqBody.fuelTypeId)) throw new userException(userErrors.invalidFuelId)
    if (!util.isMongoIdStringValid(reqBody.locationId)) throw new userException(userErrors.invalidLocationId)
    if (!util.isMongoIdStringValid(reqBody.vehicleSubCategoryId)) throw new userException(userErrors.invalidVehicleSubCategoryId)

    return validate(reqBody, {
        "additionalProperties": false,
        "type": "object",
        "properties": {
            "vehicleModel": { "type": "string", "required": true },
            "vehicleNumber": { "type": "string", "required": true },
            "color": { "type": "string", "required": true },
            "vehicleSubCategoryId": { "type": "string", "format": "ObjectId", "required": true },
            "fuelTypeId": { "type": "string", "format": "ObjectId", "required": true },
            "locationId": { "type": "string", "format": "ObjectId", "required": true },
            "carImageUrl": { "type": "string", "required": true },
            "availability_status": { "type": "number", "required": true, enum: enums.availabilityStatus },
        }
    })
}

const updateAvailability = (reqBody) => {

    // Mongo ID Validation
    if (!util.isMongoIdStringValid(reqBody.vehicleId)) throw new userException(userErrors.vehicleNotFound)

    return validate(reqBody, {
        "additionalProperties": false,
        "type": "object",
        "properties": {
            "vehicleId": { "type": "string", "format": "ObjectId", "required": true },
            "availability_status": { "type": "number", "required": true, enum: enums.availabilityStatus },
        }
    })
}

const getVehicles = (reqBody) => {

    // Mongo ID Validation
    if (!util.isMongoIdStringValid(reqBody.locationId)) throw new userException(userErrors.invalidLocationId)

    return validate(reqBody, {
        "additionalProperties": false,
        "type": "object",
        "properties": {
            "locationId": { "type": "string", "format": "ObjectId", "required": true },
            "categoryName": { "type": "string", "required": false },
            "pickUpDate": { "type": "string", "required": true },
            "dropDate": { "type": "string", "required": true },
        }
    })
}

const bookVehicle = (reqBody) => {

    // Mongo ID Validation
    if (!util.isMongoIdStringValid(reqBody.locationId)) throw new userException(userErrors.invalidLocationId)
    if (!util.isMongoIdStringValid(reqBody.vehicleId)) throw new userException(userErrors.vehicleNotFound)

    return validate(reqBody, {
        "additionalProperties": true,
        "type": "object",
        "properties": {
            "vehicleId": { "type": "string", "format": "ObjectId", "required": true },
            "locationId": { "type": "string", "format": "ObjectId", "required": true },
            "pickupDate": { "type": "string", "required": true },
            "dropoffDate": { "type": "string", "required": true },
            "bookingDate": { "type": "string", "required": true },
            "amount": { "type": "number", "required": true }
        }
    })
}

module.exports = {
    signUp,
    login,
    addVehicle,
    updateAvailability,
    getVehicles,
    bookVehicle
}