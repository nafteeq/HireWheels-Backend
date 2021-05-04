'use strict';

const util = require("../tools/util")
const apiLogger = require("../tools/logging").apiLogger
const authController = require("../controller/auth")
const validationError = require("../constants/errors").validationError
const apiValidators = require("../tools/apiValidators")
const refStrings = require("../constants/refStrings")

async function signUp(req, res){

    try{

        // Reference
        let validate
        let response
        let firstName
        let lastName
        let email
        let password
        let mobileNo

        // Log Request
        await apiLogger.logRequest(req)

        // Validate Request
        validate = apiValidators.signUp(req.body)
        if (!validate.valid) validationError(validate.errors)

        // Get Required Params
        firstName = req.body.firstName
        lastName = req.body.lastName
        email = req.body.email
        password = req.body.password
        mobileNo = req.body.mobileNo

        // Business Logic
        await authController.signUp(firstName, lastName, email, password, mobileNo)

        // Response
        response = await util.customResponse(refStrings.successSignUp, 200)

        // Log Response
        apiLogger.logResponse(response)

        // Send Response
        res.status(200).send(response)

    }
    catch(exception){
        await util.handleErrorResponse(exception, res)
    }

}

async function login(req, res){

    try{

        // Reference
        let validate
        let response
        let email
        let password

        // Log Request
        await apiLogger.logRequest(req)

        // Validate Request
        validate = apiValidators.login(req.body)
        if (!validate.valid) validationError(validate.errors)

        // Get Required Params
        email = req.body.email
        password = req.body.password

        // Business Logic
        response = await authController.login(email, password)

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
    signUp,
    login
}