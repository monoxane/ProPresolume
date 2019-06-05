const debug = require('debug')('propresolume:config')
const path = require('path')
const fs = require('fs')
const yaml = require('js-yaml')
const _ = require('lodash')
const yamlConfig = require('./yaml-config')
const system = require('./emitter')

const defaultConfig = {
  'default': {
    'ui': {
      'port': 5000
    },
    'propres': {
      'host': '127.0.0.1',
      'port': 5001,
      'pass': 'password'
    },
    'resolume': {
      'host': '127.0.0.1',
      'port': 7000,
      'paths': [
        '/composition/layers/1/clips/1/video/source/params/text'
      ]
    }
  }
}
var settings
const osConfigDir = process.env.APPDATA || (process.platform === 'darwin' ? process.env.HOME + 'Library/Application Support' : process.env.HOME + '/.config')
const proPresolumeConfigDir = path.join(osConfigDir, 'propresolume')
const proPresolumeConfigFile = path.join(proPresolumeConfigDir, 'config.yml')
debug(`Loading Config: ${proPresolumeConfigFile}`)
fs.promises.mkdir(path.dirname(proPresolumeConfigFile), { recursive: true })
  .then(x => fs.promises.writeFile(proPresolumeConfigFile, yaml.safeDump(defaultConfig, { 'styles': { '!!null': 'canonical' }, 'sortKeys': true }), { flag: 'wx' }))
  .then(settings = yamlConfig.readConfig(proPresolumeConfigFile))
  .catch(rej => debug(rej))
// var settings = yamlConfig.readConfig(proPresolumeConfigFile)
// system.on('configLoaded'){}
debug('Config Loaded From Disk', settings)

function config () {
}
config.get = (key) => {
  debug(`Getting config ${key}`)
  return _.get(settings, key)
}
config.set = (key, value) => {
  debug(`Setting config ${key} to ${value}`)
  _.set(settings, key, value)
  yamlConfig.updateConfig(settings, proPresolumeConfigFile, 'default')
}

module.exports = config
