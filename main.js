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

var options = {
  actionOffset: 0.0003,
  actionVolume: 0.1
}

var globalSettings = {
  spread: 0.00018,
  startMoney: 10000,
  leverage: 50
};

// extend options with global options
options = _.extend(options,globalSettings);

depotManager.createDepot(
  'DynamicScaling4Step',
  options,
  function(stockData){
    // tick function
    //console.log("tick",stockData.bid);

    if(stockData.ask < this.storage.nextEntry) {
      //var amount = 100; //@TODO: implement amount
      var amount = (options.startMoney * options.actionVolume) / stockData.ask;

      this.buy(stockData,amount,function(scope){
        // console.log("scope:",JSON.stringify(scope));
        // success  
        scope.storage.totalInvest += stockData.ask * amount;
        scope.storage.nextEntry = stockData.ask * (1 - options.actionOffset);
        scope.storage.nextExit  = scope.storage.totalInvest * (1 + options.actionOffset);
        console.log('buy(amount:', amount , ') - money: ',scope.bank.money);

      },function(scope){
        // failed
        // @TODO: implement emergecy exit
        console.log('failed - im done :/');
      });
    }

    if(stockData.bid * this.bank.hold > this.storage.nextExit) {
      //var amount = 100; // @TODO: implement amount
      var amount = this.bank.hold;

      this.sell(stockData,amount,function(scope){
        // success
        scope.storage.totalInvest -= amount * stockData.bid;
        scope.storage.nextEntry = stockData.ask * (1 - options.actionOffset);
        scope.storage.nextExit  = stockData.ask * (1 + options.actionOffset);
        console.log('sell(amount:', amount ,') - total: ',scope.bank.money);
      },function(scope){
        // failed
        // not really a fail... just nothing to so... just raice the entry point
        scope.storage.nextEntry = stockData.ask * (1 - options.actionOffset);
        scope.storage.nextExit  = stockData.ask * (1 + options.actionOffset);
        console.log('raise the entrypoint');
      });
    }
  },
  function(stockData){
    // init function
    this.storage.startExchangeRate = stockData.ask;
    this.storage.lastEntry = stockData.ask;
    this.storage.nextEntry = this.storage.lastEntry * (1 - this.settings.actionOffset);
    this.storage.nextExit  = this.storage.lastEntry * (1 + this.settings.actionOffset);
    this.storage.totalInvest = 0; 
    
    console.log('nextEntry',this.storage.nextEntry);
    console.log('nextExit',this.storage.nextExit);
  }
);

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({width: 1400, height: 800})

  // and load the index.html of the app.
  /*
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))
*/

  var ipc = electron.ipcMain;

  win.loadURL('https://www.dailyfx.com/deutsch/kostenlose_forex_charts/kurse');
  //win.loadURL('https://github.com')

  // Open the DevTools.
  // devtools causing errors on mac
  //win.webContents.openDevTools()

  win.webContents.on('dom-ready', () => {
    setInterval(function(){
      win.webContents.executeJavaScript(`
        //require('electron').ipcRenderer.send('gpu', document.body.innerHTML.length);
        require('electron').ipcRenderer.send('gpu', document.querySelector("#EURUSD_bid > span").firstChild.nodeValue);
      `);
    },100);
  });

  ipc.on('gpu', (_, gpu) => {
    depotManager.tick(parseFloat(gpu));
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

