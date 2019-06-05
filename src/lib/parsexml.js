const parseString = require('xml2js').parseString
const debug = require('debug')('parseXML')
const system = require('./emitter')

function parseXML (XML) {
  parseString(XML, function (err, result) {
    if (err) debug(err)
    if (typeof result.StageDisplayData !== 'undefined') {
      if (result.StageDisplayData.Fields[0].Field[1]._ === undefined) {
        system.emit('xmlUpdate', '')
      } else {
        system.emit('xmlUpdate', result.StageDisplayData.Fields[0].Field[1]._.replace(/’|‘/g, '\''))
      }
    }
  })
}

module.exports = parseXML
