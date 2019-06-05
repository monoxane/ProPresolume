const debug = require('debug')('propresolume:express')
const path = require('path')
const express = require('express')
const config = require('./lib/config')
const system = require('./lib/emitter')

const app = express()
const port = config.get('ui.port')

app.use('/public', express.static(path.join(__dirname, 'ui', 'public')))

app.get('/', (req, res) => res.sendFile(path.join(__dirname, '/ui/index.html')))

app.get('/api/v1/set/propres', function (req, res) {
  res.send(`Resolume Host: ${config.resolume.host}`)
})

// /api/v1/set/propres?propresip=10.0.1.9&propresport=2555&proprespass=SD

app.get('/api/v1/set/resolume', function (req, res) {
  res.send(`Resolume Host: ${config.resolume.host}`)
})

system.on('configLoaded', function () {
  app.listen(port, () => debug(`Example app listening on port ${port}!`))
})
