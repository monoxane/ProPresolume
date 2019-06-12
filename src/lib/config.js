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

const debug = require('debug')('propresolume:config')
const path = require('path')
const fs = require('fs')
const yaml = require('js-yaml')
const _ = require('lodash')
const yamlConfig = require('./yaml-config')

// This is the default config that gets written if a config is not present on the system at runtime
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

// Consts to define the location of the configuration file on each system, its varies depending on what the system returns then asked about specific special paths, which allows us to save in the right place for the OS
const osConfigDir = process.env.APPDATA || (process.platform === 'darwin' ? process.env.HOME + '/Library/Application Support' : process.env.HOME + '/.config')
const proPresolumeConfigDir = path.join(osConfigDir, 'propresolume')
const proPresolumeConfigFile = path.join(proPresolumeConfigDir, 'config.yml')
debug(`Loading Config: ${proPresolumeConfigFile}`)
// Make the config location if it doesn't exist
fs.promises.mkdir(path.dirname(proPresolumeConfigFile), { recursive: true })
  .then(x => fs.promises.writeFile(proPresolumeConfigFile, yaml.safeDump(defaultConfig, { 'styles': { '!!null': 'canonical' }, 'sortKeys': true }), { flag: 'wx' }))
  .then(settings = yamlConfig.readConfig(proPresolumeConfigFile))
  .catch(rej => debug(rej))
debug('Config Loaded From Disk', settings)

function config () {
  // Blank root function
}
// Get config items from the store on disk
config.get = (key) => {
  debug(`Getting config ${key}`)
  return _.get(settings, key)
}
// Set config items to both memory and the disk location
config.set = (key, value) => {
  debug(`Setting config ${key} to ${value}`)
  _.set(settings, key, value)
  yamlConfig.updateConfig(settings, proPresolumeConfigFile, 'default')
}

module.exports = config
