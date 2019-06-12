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

const debug = require('debug')('propresolume:electron')
const config = require('./lib/config')
const { app, BrowserWindow } = require('electron')

const system = require('./lib/emitter')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

function createWindow () {
  debug('Loading Window')
  // Make the UI window
  win = new BrowserWindow({
    width: 400,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    },
    titleBarStyle: 'hidden', // Hide the ugly default UI elements
    frame: false // Hide the ugly default UI elements
  })

  // Load the express location
  win.loadURL(`http://127.0.0.1:${config.get('ui.port')}`)

  // Emitted when the window is closed.
  win.on('closed', () => {
    win = null
  })
}

// Init the window
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  system.emit('quit', '') // Emit a close to do garbage collection and cleanup throughout the project
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // Stoopid Darwin
  if (win === null) {
    createWindow()
  }
})
