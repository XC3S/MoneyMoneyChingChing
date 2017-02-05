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

	// Names: Titanic,Dreamer,Trendy,CookieCutter,Specter,BananaRazer,Tensions

	// Features: w8 for huge timebased drops; Trend Following

	_.each(depotList,function(entry){
		require(entry)(depotManager,globalSettings);
	});

	


}