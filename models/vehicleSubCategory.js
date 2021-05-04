'use strict';

const mongoose_validator = require('validator');
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const collections = require('../constants/collections')

const schema = new Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        auto: true,
        alias: 'vehicleSubCategoryId'
    },

    // Data
    vehicleSubCategoryName: {type: String, required: true, unique:true},
    pricePerDay: {type: Number, required: true},

    // Reference
    vehicleCategoryId: {type: mongoose.Schema.Types.ObjectId, required: true, ref: collections.vehicleCategory},

    // Mandatory Columns
    createdDate: { type: Date, default: Date.now }, // Created Date
    updatedDate: { type: Date, default: Date.now }, // Updated Date
    isActive: { type: Boolean, default: true }, // On/Off Flag
    deleted: { type: Boolean, default: false }, // Soft Delete Flag
    comment: { type: String, default: null } // If any

}, { collection: collections.vehicleSubCategory })

// Model
const VehicleSubCategoryModel = mongoose.model(collections.vehicleSubCategory, schema)

module.exports = { VehicleSubCategoryModel }
