var yaml = require('js-yaml') // register .yaml require handler
var fs = require('fs')
const debug = require('debug')('propresolume:yaml-config')

var extend = function (dest, from) {
  var props = Object.getOwnPropertyNames(from)
  props.forEach(function (name) {
    if (name in dest && typeof dest[name] === 'object') {
      extend(dest[name], from[name])
    } else {
      var destination = Object.getOwnPropertyDescriptor(from, name)
      Object.defineProperty(dest, name, destination)
    }
  })
}

/**
* Removes properties of the 'dest' object where the 'from' objects
* properties exactly match those in the 'dest' object
*
* @private
* @param {Object} dest An obect with a set of properties
* @param {Object} from An object with an overlapping set of properties you wish to remove from 'dest'
 */

var complement = function (dest, from) {
  var props = Object.getOwnPropertyNames(from)
  props.forEach(function (name) {
    if (name in from && typeof from[name] === 'object') {
      if (typeof dest[name] !== 'undefined') {
        complement(dest[name], from[name])
        // If all keys were removed, remove the object
        if (Object.keys(dest[name]).length === 0) {
          delete dest[name]
        }
      }
    } else {
      if (dest[name] === from[name]) {
        delete dest[name]
      }
    }
  })
}

var readConfig = function (configFile, env) {
  if (!env) {
    env = process.env.NODE_ENV || 'development'
  }
  debug('Using %s environment.', env)

  try {
    // The require method  of loading the configuration doesnt semm dependable
    // When called several times in a row, it causes the tests to fail
    // var config = require(config_file);
    var configData = fs.readFileSync(configFile, 'utf8')
    var config = yaml.safeLoad(configData)
    var settings = config['default'] || {}
    var settingsEnv = config[env] || {}

    extend(settings, settingsEnv)

    debug('Read settings for \'%s\': %s', env, JSON.stringify(settings))
    return settings
  } catch (e) {
    debug(e)
    return {}
  }
}
/**
* Updates the 'config_file object such that it only contain properties that are different from the defaults
* and writes the modified configuration for that environment back to the specified yaml configuration file
*
* NOTE: Currently this function does not support preserving comments
*
* @private
* @param {Object} current_config A settings object representing an updated state for a configuration file
* @param {String} config_file A path to an existing configuration file
* @param {String} env The section to be updated
 */

var updateConfig = function (currentConfig, configFile, env) {
  if (!configFile) {
    // May want to add functionality to write out to a different file later.
    debug('No configuration file specified, no update peformed')
    return
  }
  if (!env) {
    env = process.env.NODE_ENV || 'development'
  }
  debug('Updating %s environment.', env)

  try {
    // Load settings from the configuration file
    var configData = fs.readFileSync(configFile, 'utf8')
    var config = yaml.safeLoad(configData)
    var settings = config['default'] || {}
    if (currentConfig === null || Object.keys(currentConfig).length === 0) {
      if (typeof config[env] !== 'undefined') {
        delete config[env]
      }
      debug('Deleted settings for \'%s\': %s', env, JSON.stringify(config))
    } else {
      if (env !== 'default') {
        // Remove all properties from the current configuration that exist
        // in the default AND are equal to the default value
        complement(currentConfig, settings)
      }
      // Update the values in the configuration
      config[env] = currentConfig
      debug('Updated settings for \'%s\': %s', env, JSON.stringify(config))
    }
    var output = yaml.safeDump(config, config.CORE_SCHEMA)
    fs.writeFileSync(configFile, output, 'utf8')
  } catch (e) {
    debug(e)
  }
}

module.exports.readConfig = readConfig
module.exports.updateConfig = updateConfig
