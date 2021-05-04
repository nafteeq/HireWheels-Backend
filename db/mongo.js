'use strict';

//Direct DB connection for transactions
const MongoClient = require('mongodb').MongoClient
const conf = require('../config/config.js')
const mongoose = require('mongoose');
const collections = require('../constants/collections');

// MongoDB connection Params
const uri = conf.db.uri
const options = conf.db.options
var _db

// Making the debug option on in development configuration
// if (conf.env == "development") mongoose.set('debug', true);

// Connect MongoDB
const connectDB = () => {
    console.log("Connecting Mongo URI ====>" , uri)
    return MongoClient.connect(uri, options).then((db) => {
        _db = db.db(conf.db.name)
        mongoose.connect(uri, conf.db.optionsMongoose).then(() => {},
            err => { console.error(err) }
        )
        return new Promise((resolve, reject) => { resolve(_db) })
    }).catch((err) => {
        return new Promise((resolve, reject) => { reject(err) })
    })
}

const getDB = () => _db

const disconnectDB = () => _db.close()

const createCollections = () => {

    return new Promise((resolve, reject) => {
        Object.values(collections).map(collection => {
            _db.createCollection(collection, (err) => {
                if (err) reject(err)
                else console.log(collection);
            })
        })
    })
}

const createIndexes = () => {
    _db.collection(collections.user).createIndexes([{ key: { email: 1 }, unique: true, name: "UniqueEmailIndex" }]).then(() => { console.log('Index Created on User Email') }).catch(err => { console.error(err) });
    _db.collection(collections.user).createIndexes([{ key: { mobileNo: 1 }, unique: true, name: "UniqueMobileNoIndex" }]).then(() => { console.log('Index Created on User Mobile Number') }).catch(err => { console.error(err) });
    _db.collection(collections.vehicleCategory).createIndexes([{ key: { vehicleCategoryName: 1 }, unique: true, name: "UniqueVehicleCategoryNameIndex" }]).then(() => { console.log('Index Created on Vehicle Category Name') }).catch(err => { console.error(err) });
    _db.collection(collections.vehicleSubCategory).createIndexes([{ key: { vehicleSubCategoryName: 1 }, unique: true, name: "UniqueVehicleSubCategoryNameIndex" }]).then(() => { console.log('Index Created on Vehicle Sub Category Name') }).catch(err => { console.error(err) });
}

module.exports = { connectDB, getDB, disconnectDB, MongoClient, createIndexes, createCollections}