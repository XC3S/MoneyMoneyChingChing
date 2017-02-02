module.exports = webServerProvider;

var express = require('express')();
var server = require('http').Server(express);

function webServerProvider(depotManager){
	// launch server
	server.listen(3000);

	//provide fontend entry point
	express.get('/',function(req,res){
		res.sendFile(__dirname + '/frontend/index.html');
	});
}