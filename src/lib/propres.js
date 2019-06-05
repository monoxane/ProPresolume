const config = require('./config')
const net = require('net')
const debug = require('debug')('propresolume:propres')
const system = require('./emitter')

class Client {
  constructor (port, address) {
    this.socket = new net.Socket()
    this.address = config.get('propres.host')
    this.port = config.get('propres.port')
    this.pass = config.get('propres.pass')
    this.init()
  }
  init () {
    var client = this

    client.socket.connect(client.port, client.address, () => {
      debug(`Connecting to: ${client.address}:${client.port}`)
      client.socket.write(`<StageDisplayLogin>${client.pass}</StageDisplayLogin>\r\n`)
      debug('Connected')
    })

    client.socket.on('data', (data) => {
      // debug(`Client received: ${data}`)
      system.emit('dataUpdate', data.toString())
    })

    client.socket.on('close', () => {
      system.emit('xmlUpdate', '')
      debug('Client closed')
    })

    client.socket.on('error', (err) => {
      debug(err)
    })

    system.on('quit', function () {
      client.socket.destroy()
    })
  }
}
module.exports = Client
