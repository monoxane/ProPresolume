const debug = require('debug')('propresolume:resolume')
const config = require('./config')
var osc = require('osc')

var udpPort = new osc.UDPPort({
  localAddress: '0.0.0.0',
  localPort: 57121,
  metadata: true
})

udpPort.open()

function sendResolume (text) {
  config.get('resolume.paths').forEach(function (currentClip, index, arr) {
    debug('Sending', JSON.stringify(text), 'to', currentClip)
    udpPort.send({
      address: currentClip,
      args: [
        {
          type: 's',
          value: text
        }
      ]
    }, config.get('resolume.host'), config.get('resolume.port'))
  })
}

module.exports = sendResolume
