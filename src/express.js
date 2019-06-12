/*
 * This file is part of the ProPresolume project
 * Copyright (c) 2019 Oliver Herrmann
 * Authors: Oliver Herrmann <oliver@monoxane.com>
 *
 * This program is free software.
 * You should have received a copy of the MIT licence along with
 * this program.
 *
 * You can be released from the requirements of the license by purchasing
 * a commercial license. Buying such a license is mandatory as soon as you
 * develop commercial activities involving the ProPresolume software without
 * disclosing the source code of your own applications.
 *
 */

const debug = require('debug')('propresolume:express')
const path = require('path')
const express = require('express')
const config = require('./lib/config')
const system = require('./lib/emitter')

const app = express()
const port = config.get('ui.port')

var router = express.Router() // Init router

router.use(function (req, res, next) {
  debug(req, res) // Debug routes
  next() // Keep processing
})

// API base route and a silly status indicator to fill it up
router.get('/', function (req, res) {
  res.json({ status: 200 })
})

// Config API routes
app.use('/api', router)
