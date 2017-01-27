const {app, BrowserWindow} = require('electron')
var electron = require('electron');

const path = require('path')
const url = require('url')
const fs = require('fs')
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({width: 800, height: 600})

  // and load the index.html of the app.
  /*
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))
*/

  var ipc = electron.ipcMain;

  win.loadURL("https://www.dailyfx.com/deutsch/kostenlose_forex_charts/kurse");
  //win.loadURL('https://github.com')

  // Open the DevTools.
  win.webContents.openDevTools()

  win.webContents.on('dom-ready', () => {
    setInterval(function(){
      win.webContents.executeJavaScript(`
        //require('electron').ipcRenderer.send('gpu', document.body.innerHTML.length);
        require('electron').ipcRenderer.send('gpu', document.querySelector("#EURUSD_bid > span").firstChild.nodeValue);
      `);
    },100);
  });

  ipc.on('gpu', (_, gpu) => {
    console.log(gpu)
  })



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

