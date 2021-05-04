'use strict';

const mongoose_validator = require('validator');
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const collections = require('../constants/collections')
const refStrings = require('../constants/refStrings')
const enums = require("../constants/enums")

const schema = new Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        auto: true,
        alias: 'userId'
    },
    email: { type: String, unique: true, trim: true, maxlength: 64, lowercase: true,
        validate: {
            isAsync: false,
            validator: mongoose_validator.isEmail,
            message: 'Please fill a valid email address'
        }
    },
    mobileNo: { type: Number, unique: true},
    password: {type: String, required: true},
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    roleName: {type: String, enum: enums.roleNames , required: true, default: refStrings.user},
    suspended: { type: Boolean, default: false },
    lastLogin: { type: Date},
    walletMoney: { type: Number, default: 0 },

    // Mandatory Columns
    createdDate: { type: Date, default: Date.now }, // Created Date
    updatedDate: { type: Date, default: Date.now }, // Updated Date
    isActive: { type: Boolean, default: true }, // On/Off Flag
    deleted: { type: Boolean, default: false }, // Soft Delete Flag
    comment: { type: String, default: null } // If any

}, { collection: collections.user })

// Model
const UserModel = mongoose.model(collections.user, schema)

module.exports = { UserModel }
