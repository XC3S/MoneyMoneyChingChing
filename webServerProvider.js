module.exports = webServerProvider;

var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

function webServerProvider(depotManager){
	// launch server
	server.listen(3000,function(){
		console.log("webserver started!");
	});

	// host frontend sources
	app.use(express.static(__dirname + '/frontend'));

	// 
}