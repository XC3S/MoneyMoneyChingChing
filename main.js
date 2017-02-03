const {app, BrowserWindow} = require('electron')
var electron = require('electron');

var path = require('path')
var url = require('url')
var fs = require('fs')
var _ = require('underscore-node')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

var depotManager = require('./depotManager.js');
var depotInitializer = require('./depotInitializer.js')(depotManager);
var webServerProvider = require('./webServerProvider.js')(depotManager);


function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({width: 1400, height: 800, show: false})

  var ipc = electron.ipcMain;

  win.loadURL('https://www.dailyfx.com/deutsch/kostenlose_forex_charts/kurse');
  //win.loadURL('https://github.com')

  // Open the DevTools.
  // devtools causing errors on mac
  // win.webContents.openDevTools()

  // crawler
  // grap the page html directly from the rendering buffer
  win.webContents.on('dom-ready', () => {
    setInterval(function(){
      win.webContents.executeJavaScript(`
        require('electron').ipcRenderer.send('eurusd', document.querySelector("#EURUSD_bid > span").firstChild.nodeValue);
      `);
    },100);
  });

  ipc.on('eurusd', (_, eurusd) => {
    depotManager.tick(parseFloat(eurusd));
  });



  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

