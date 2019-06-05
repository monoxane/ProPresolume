const debug = require('debug')('propresolume:index')
// const config = require('arcee')

const parseXML = require('./lib/parsexml')
const ProPres = require('./lib/propres')
const Resolume = require('./lib/resolume')
const system = require('./lib/emitter')
const config = require('./lib/config')

require('./electron')
require('./express')
require('./lib/config')

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

system.on('configLoaded', function () {
  debug('Initialising ProPres Connection')
  // eslint-disable-next-line no-new
  new ProPres()
})

system.on('dataUpdate', function (data) {
  parseXML(data)
})

system.on('xmlUpdate', function (data) {
  Resolume(data)
})

system.on('quit', function () {
  debug('Somewhere, The system wants to quit.')
  // setTimeout(function () {
  //   process.end()
  // }, 5000)
})

system.emit('configLoaded')
