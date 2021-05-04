'use strict';

// Global
var config = {}
config.env = 'development'

// SAAS
config.saas = {}

/********************JWT config*************************/
config.jwt = {}
config.jwt.expiryTime = 1800 // In seconds => 30 mins
config.jwt.secret = `-----BEGIN EC PRIVATE KEY-----
MHcCAQEEIP4L9FupLbdFctgS5Ew3Z14VPJnu3mRTQJpJ1S+Y9OdVoAoGCCqGSM49
AwEHoUQDQgAEZPIKrZHdDLt11H5P1aIK9eI245HFm8OL82Q+OOOPBKcYbJ5EMbpR
ReWF+1XU0IxP/paX1D4XBFNCwtETAeClzQ==
-----END EC PRIVATE KEY-----`

config.jwt.publicKey = `-----BEGIN PUBLIC KEY-----
MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEZPIKrZHdDLt11H5P1aIK9eI245HF
m8OL82Q+OOOPBKcYbJ5EMbpRReWF+1XU0IxP/paX1D4XBFNCwtETAeClzQ==
-----END PUBLIC KEY-----`
config.jwt.options = {
    algorithm: 'HS256'
}
/********************JWT config*************************/

/********************Express Server config*************************/
config.server = {}
config.server.host = '0.0.0.0'
config.server.port = 8012
/********************Express Server config*************************/

/********************Mongo config*************************/
config.db = {};
config.db.username = 'nafees'
config.db.password = 'nafees123'
config.db.hosts = ['127.0.0.1:27017']
config.db.name = 'hirewheels'
config.db.options = {
    forceServerObjectId: true,
    bufferMaxEntries: 0, poolSize: 10, useUnifiedTopology: true, useNewUrlParser: true
}
config.db.optionsMongoose = {
    forceServerObjectId: true,
    autoIndex: false, poolSize: 10, useCreateIndex: true, useFindAndModify: false, useUnifiedTopology: true, useNewUrlParser: true, keepAlive: true
}
config.db.uri = 'mongodb://' + config.db.username + ':' + config.db.password + '@' +
    config.db.hosts[0] + "/" + config.db.name
/********************Mongo config*************************/

/**********************Logging***********************/
config.logs = {}
config.logs.consoleLogs = true
config.logs.fileLogs = false
config.logs.api = {}
config.logs.api.path = "/var/log/hirewheels/"
config.logs.api.category = "API"
/**********************Logging***********************/

module.exports = config;