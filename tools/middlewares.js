
const userException = require('../tools/userException')
const userErrors = require("../constants/errors").userErrors
const config = require("../config/config")
const jwt = require('jsonwebtoken')
const util = require("../tools/util")
const refStrings = require("../constants/refStrings")

// User authentication through jwt token
async function isUserAuthenticated(req, res, next) {

    try {

        // Reference
        let authorization

        // Get Auth
        authorization = req.headers['x-access-token'];

        // Check if auth Exist
        if (!authorization) throw new userException(userErrors.missingAuth)

        // Verify JWT
        await jwt.verify(authorization, config.jwt.secret, async (err, decoded) => {

            // If failed
            if (err) {
                throw new userException(userErrors.invalidAuth)
            }

            // Check Role
            roleName = decoded.roleName
            if(roleName != refStrings.user) throw new userException(userErrors.unauthorizedAccess)

            // Assign Data
            req.auth = decoded

            // Forrward Request
            next();
        })

    } catch (exception) {
        await util.handleErrorResponse(exception, res)
    }

}

// User authentication through jwt token
async function isAdminAuthenticated(req, res, next) {

    try {

        // Reference
        let authorization

        // Get Auth
        authorization = req.headers['x-access-token'];

        // Check if auth Exist
        if (!authorization) throw new userException(userErrors.missingAuth)

        // Verify JWT
        await jwt.verify(authorization, config.jwt.secret, async (err, decoded) => {

            // If failed
            if (err) {
                throw new userException(userErrors.invalidAuth)
            }

            // Check Role
            roleName = decoded.roleName
            if(roleName != refStrings.admin) throw new userException(userErrors.unauthorizedAccess)

            // Assign Data
            req.auth = decoded

            // Forrward Request
            next();
        })

    } catch (exception) {
        await util.handleErrorResponse(exception, res)
    }

}

module.exports = {
    isUserAuthenticated,
    isAdminAuthenticated
}