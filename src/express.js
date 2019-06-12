const debug = require('debug')('propresolume:express')
const path = require('path')
const express = require('express')
const config = require('./lib/config')
const system = require('./lib/emitter')

const app = express()
const port = config.get('ui.port')

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router() // get an instance of the express Router

// middleware to use for all requests
router.use(function (req, res, next) {
  // do logging
  debug('Something is happening.')
  next() // make sure we go to the next routes and don't stop here
})

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function (req, res) {
  res.json({ message: 'hooray! welcome to our api!' })
})

// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router)
