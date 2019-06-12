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

const parseString = require('xml2js').parseString
const debug = require('debug')('parseXML')
const system = require('./emitter')

// This function parses the XML returned by ProPres() into JSON objects and extracts the stage display data we need
function parseXML (XML) {
  parseString(XML, function (err, result) {
    if (err) debug(err)
    if (typeof result.StageDisplayData !== 'undefined') {
      if (result.StageDisplayData.Fields[0].Field[1]._ === undefined) {
        // Emit blank if data doesn't exist (usually on the first update of a connection)
        system.emit('xmlUpdate', '')
      } else {
        // Else emit the data
        system.emit('xmlUpdate', result.StageDisplayData.Fields[0].Field[1]._.replace(/’|‘/g, '\''))
      }
    }
  })
}

module.exports = parseXML
