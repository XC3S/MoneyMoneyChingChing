module.exports = webServerProvider;

var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

function webServerProvider(depotManager){
	var stockCache,stockLive;

	// launch server
	server.listen(3000,function(){
		console.log("webserver started!");
	});

	// host frontend sources
	app.use(express.static(__dirname + '/../frontend'));

	// allways send the lates informations to new connections
	io.on('connection',function(socket){
		socket.emit("receiveDepotData",{
			'depots': depotManager.getDepots(),
			'curse': depotManager.getStockData()
		});
	});

	// replicate changes
	depotManager.onTick(function(){
		stockLive = JSON.stringify(depotManager.getStockData());
		if(stockCache != stockLive){
			stockCache = JSON.stringify(depotManager.getStockData());
			io.emit("receiveDepotData",{
				'depots': depotManager.getDepots(),
				'curse': depotManager.getStockData()
			});
		}
	});
}