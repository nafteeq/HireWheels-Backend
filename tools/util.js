'use strict';

const config = require("../config/config")
const jwt = require('jsonwebtoken')
const userException = require('./userException')
const userErrors = require("../constants/errors").userErrors
const apiLogger = require("./logging").apiLogger
const crypto = require("crypto")
const ObjectId = require('mongoose').Types.ObjectId;

function isMongoIdStringValid(id){
  return ObjectId.isValid(id)
}

async function customResponse(message, statusCode) {

  let response = {}
  response['timestamp'] = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
  response['message'] = message
  response['statusCode'] = statusCode
  return response

}

async function createJwtToken(userData){

  // JWT Token
  let iat = Math.floor(new Date().getTime() / 1000)
  let token = jwt.sign({
      userId: userData._id,
      sub: userData.email,
      roleName: userData.roleName,
      iat : iat,
      exp : iat + config.jwt.expiryTime,
    },
    config.jwt.secret, config.jwt.options
  )

  return token
}

async function handleErrorResponse(exception, res){

  // Reference
  let response
  let statusCode

  // Handle User Exception
  if(exception instanceof userException){
      statusCode = exception.statusCode
      response = await customResponse(exception.message, exception.statusCode)
  }else{ // Internal Server Error
      statusCode = userErrors.oopsSomethingWentWrong.statusCode
      response = await customResponse(userErrors.oopsSomethingWentWrong.message, userErrors.oopsSomethingWentWrong.statusCode)
  }

  // Log error
  apiLogger.LogError(exception)

  // Log Response
  apiLogger.logResponse(response, statusCode)

  // Send Response
  res.status(statusCode).send(response)

}

// async for each function
async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
  }
}

async function generatePasswordHash(password) {
  return new Promise((resolve, reject) => {
      let salt = crypto.randomBytes(8).toString("hex")
      crypto.scrypt(password, salt, 64, (err, derivedKey) => {
          if (err) reject(err);
          resolve(salt + ":" + derivedKey.toString('hex'))
      });
  })
}

async function isPasswordValid(password, dbPassword) {
  return new Promise((resolve, reject) => {
      let [salt, key] = dbPassword.split(":")
      crypto.scrypt(password, salt, 64, (err, derivedKey) => {
          if (err) reject(err);
          resolve(key == derivedKey.toString('hex'))
      });
  })
}

module.exports = {
  createJwtToken,
  handleErrorResponse,
  asyncForEach,
  isPasswordValid,
  generatePasswordHash,
  customResponse,
  isMongoIdStringValid
}