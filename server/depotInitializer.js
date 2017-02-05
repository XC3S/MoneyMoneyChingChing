module.exports = depotInitializer;

var _ = require('underscore-node')

function depotInitializer(depotManager){

	var globalSettings = {
		spread: 0.00006,
		startMoney: 10000,
		leverage: 100
	};

	var depotList = [
		"./depots/Atlas.js",
		"./depots/Gambler.js"
	];

	_.each(depotList,function(entry){
		require(entry)(depotManager,globalSettings);
	});

	


}