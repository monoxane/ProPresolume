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

// Pretty basic OSC sender to send text data to many OSC endpoints and paths

const debug = require('debug')('propresolume:resolume')
const config = require('./config')
var osc = require('osc')

// Make the OSC port and open it to allow data to be sent
var udpPort = new osc.UDPPort({
  localAddress: '0.0.0.0',
  localPort: 57121,
  metadata: true
})

udpPort.open()

// Send the actual data
function sendResolume (text) {
  config.get('resolume.paths').forEach(function (currentClip, index, arr) { // Gets all OSC paths from the configuration
    debug('Sending', JSON.stringify(text), 'to', currentClip)
    udpPort.send({ // Sends the input to the current OSC path
      address: currentClip,
      args: [
        {
          type: 's',
          value: text
        }
      ]
    }, config.get('resolume.host'), config.get('resolume.port')) // on the current Resolume host
  })
}

module.exports = sendResolume
