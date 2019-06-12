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

const debug = require('debug')('propresolume:index')
const parseXML = require('./lib/parsexml')
const ProPres = require('./lib/propres')
const Resolume = require('./lib/resolume')
const system = require('./lib/emitter')

require('./electron')
require('./express')
require('./lib/config')

// Logo in debug, yes, I did go to the effort to ASCII art it, then JS escape it all, then stop eslint from going crazy
// eslint-disable-next-line quotes
debug("______         ______                          _                      ")
// eslint-disable-next-line quotes
debug("| ___ \\        | ___ \\                        | |                     ")
// eslint-disable-next-line quotes
debug("| |_/ / __ ___ | |_/ / __ ___ ______ ___  ___ | |_   _ _ __ ___   ___ ")
debug("|  __/ '__/ _ \\|  __/ '__/ _ \\______/ __|/ _ \\| | | | | '_   _ \\ / _ \\")
// eslint-disable-next-line quotes
debug("| |  | | | (_) | |  | | |  __/      \\__ \\ (_) | | |_| | | | | | |  __/")
// eslint-disable-next-line quotes
debug("\\_|  |_|  \\___/\\_|  |_|  \\___|      |___/\\___/|_|\\__,_|_| |_| |_|\\___|")
debug('')

// Init everything when the config is loaded
system.on('configLoaded', function () {
  debug('Initialising ProPres Connection')
  // eslint-disable-next-line no-new
  new ProPres() // Init ProPres connection
})

// On XML Data from ProPres, pass it to the XML parser
system.on('dataUpdate', function (data) {
  parseXML(data)
})

// Pass the returned object with the text data to the Resolume OSC handler
system.on('xmlUpdate', function (data) {
  Resolume(data)
})

// If a quit is emitted do garbage cleanup and exit cleanly
system.on('quit', function () {
  debug('Somewhere, The system wants to quit.')
  // setTimeout(function () {
  //   process.end()
  // }, 5000)
})

system.emit('configLoaded') // This is actually currently useless and I need to fix it
