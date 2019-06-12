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

const config = require('./config')
const net = require('net')
const debug = require('debug')('propresolume:propres')
const util = require('util')
const setTimeoutPromise = util.promisify(setTimeout)
const system = require('./emitter')

// This class connects to the propresenter 6 Stage Display connection and emits that data for use elsewhere.

class Client {
  constructor (port, address) {
    this.socket = new net.Socket()
    // Config variables
    this.address = config.get('propres.host')
    this.port = config.get('propres.port')
    this.pass = config.get('propres.pass')

    // Actually init the class
    this.init()
  }
  init () {
    var client = this

    // Socket connection function, is in a function to allow autoreconnect on socket close or failure
    function connect () {
      client.socket.connect(client.port, client.address, () => {
        debug(`Connecting to: ${client.address}:${client.port}`)
        // Send Stage Display login command with password defined in config
        client.socket.write(`<StageDisplayLogin>${client.pass}</StageDisplayLogin>\r\n`)
        debug('Connected')
      })
    }

    connect()

    // Emit data
    client.socket.on('data', (data) => {
      system.emit('dataUpdate', data.toString())
    })

    // Handle socket close and reconenct procedure
    client.socket.on('close', () => {
      system.emit('xmlUpdate', '')
      debug('Client closed')
      setTimeoutPromise(10000).then(() => { connect() })
    })

    // Standard error handling
    client.socket.on('error', (err) => {
      debug(err)
    })

    // Gotta clean up
    system.on('quit', function () {
      client.socket.destroy()
    })
  }
}
module.exports = Client
