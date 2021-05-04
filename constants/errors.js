const userException = require('../tools/userException')

function ErrorMessage(message, statusCode, result=[]) {
    this.message = message
    this.statusCode = statusCode
    this.result = result
}

const validationError = function (array) {

    // Get Validation Errors
    let meta = {}
    meta['validationErrors'] = []
    for (let i in array) {
        meta['validationErrors'].push(array[i]['stack'])
    }

    // Console
    console.error(meta)

    // Create Exception
    let exception = {}
    exception.message = "Invalid Request Format"
    exception.statusCode = 400
    throw new userException(exception)
}

// User Errors
var userErrors = {}
userErrors.oopsSomethingWentWrong = new ErrorMessage("Oops! Something went wrong", 500)
userErrors.emailAlreadyExists = new ErrorMessage("Email Already Exists", 400)
userErrors.mobileAlreadyExists = new ErrorMessage("Mobile Already Exists", 400)
userErrors.passwordValidation = new ErrorMessage("Password cannot be null or empty or less than 5 characters", 400)
userErrors.unauthorizedUser = new ErrorMessage("Unauthorized User", 401)
userErrors.userNotRegistered = new ErrorMessage("User Not Registered", 404)
userErrors.userSuspended = new ErrorMessage("User Suspended", 401)
userErrors.missingAuth = new ErrorMessage("Authroization Missing", 401)
userErrors.invalidAuth = new ErrorMessage("Authroization Invalid", 401)
userErrors.unauthorizedAccess = new ErrorMessage("Unauthroized Access", 401)
userErrors.invalidLocationId = new ErrorMessage("Invalid Location Id", 400)
userErrors.invalidFuelId = new ErrorMessage("Invalid Fuel Id", 400)
userErrors.invalidVehicleSubCategoryId = new ErrorMessage("Invalid Vehicle Sub Category Id", 400)
userErrors.vehicleNumberAlreadyExists = new ErrorMessage("Vehicle Number Already Exists", 400)
userErrors.vehicleNotFound = new ErrorMessage("Vehicle Not Found", 404)
userErrors.insufficientBalance = new ErrorMessage("Insufficient Balance. Please Check With Admin.", 403)
userErrors.invalidAmount = new ErrorMessage("Invalid Amount", 403)
userErrors.invalidDropOffDate = new ErrorMessage("DropDate should be greater than today's date and greater than PickUp Date", 400)
userErrors.invalidPickUpDate = new ErrorMessage("PickUp should be greater than today's date.", 400)
userErrors.invalidBookingDate = new ErrorMessage("Booking date should be today's date", 400)
userErrors.vehicleAlreadyBooked = new ErrorMessage("Vehicle Already Booked", 404)

module.exports = {
    userErrors,
    ErrorMessage,
    validationError
}