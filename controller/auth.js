'use strict';

const UserModel = require("../models/user").UserModel
const userException = require('../tools/userException')
const userErrors = require("../constants/errors").userErrors
const util = require("../tools/util")
const refStrings = require("../constants/refStrings")

async function signUp(firstName, lastName, email, password, mobileNo, roleName=refStrings.user) {

    try {

        // Reference
        let userAlreadyExists
        let userDBDoc
        let userData

        // lower case email and username
        email = email.toLowerCase()

        // Check if Email already exists
        userAlreadyExists = await UserModel.findOne({email})
        if (userAlreadyExists != null) throw new userException(userErrors.emailAlreadyExists)

        // Check if Phone Number already exists
        userAlreadyExists = await UserModel.findOne({mobileNo})
        if (userAlreadyExists != null) throw new userException(userErrors.mobileAlreadyExists)

        // Password Validation
        if (password.length < 5) throw new userException(userErrors.passwordValidation)

        // Hash Password
        password = await util.generatePasswordHash(password)

        // User doc
        userDBDoc = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            password : password,
            mobileNo: mobileNo,
            roleName: roleName,
            walletMoney : 10000 // Hard Coded for Testing
        }

        // Save User Data
        userData = await UserModel.create([userDBDoc])

        return true

    } catch (error) {
        throw error
    }

}

async function login(email, password) {

    try {

        // Reference
        let userData
        let response = {}
        let jwtToken
        let dbPassword
        let isPasswordValid

        // lower case email
        email = email.toLowerCase()

        // Check if Email already exists
        userData = await UserModel.findOne({email: email, suspended: false, isActive:true, deleted:false})
        if (userData == null) throw new userException(userErrors.userNotRegistered)

        // Validate Password
        dbPassword = userData.password
        isPasswordValid = await util.isPasswordValid(password, dbPassword)
        if (!isPasswordValid) throw new userException(userErrors.unauthorizedUser)

        // Check Suspended
        if (userData.suspended) throw new userException(userErrors.userSuspended)

        // Update Last Login
        userData.lastLogin = new Date()
        await userData.save()

        // Create JWT Token
        jwtToken = await util.createJwtToken(userData)

        // Create Response
        response = userData.toObject()
        delete response["password"] // Remove Password for security
        response["jwtToken"] = jwtToken

        return response

    } catch (error) {
        throw error
    }

}

module.exports = {
    signUp,
    login
}
