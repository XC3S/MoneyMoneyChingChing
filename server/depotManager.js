module.exports = depotManager();

const fs = require("fs");

function depotManager(){
	var depots = [];
	var lastStockData = {};

	var tickCallbacks = [];

	return {
		tick: function(value){
			depots.forEach(function(entry){
				var stockData = lastStockData = {
					bid: value,
					ask: value + entry.settings.spread	// forex trading platform like tradeking use a custom spread instead of an comision
				}

				if(!entry.storage.initialized) {
					entry.init(stockData);
					entry.storage.initialized = true;
				} 
				else {
					entry.tick(stockData);
				}
			});
			tickCallbacks.forEach(function(callback){
				callback();
			});
		},
		onTick: function(callback){
			tickCallbacks.push(callback);	
		},
		getDepots: function(){
			return depots
		},
		getStockData: function(){
			return lastStockData
		},
		createDepot: function(identifier,description,options,tickFunction,initFunction){
			var depot = {
				id: identifier,
				description: description,
				bank: {
					money: options.startMoney,
					margin: options.startMoney * options.leverage,
					hold: 0
				},
				settings: options,
				storage: {
					initialized: false
				}
			}

			if (!fs.existsSync(__dirname + '/../storage')){
			    fs.mkdirSync(__dirname + '/../storage');
			}

			if(fs.existsSync(__dirname + '/../storage/' + identifier + '.depot' )){
				console.log("read: " + identifier + ".depot");
				depot = JSON.parse(fs.readFileSync(__dirname + '/../storage/' + identifier + '.depot'))
			}
			else {
				console.log("create: " + identifier + ".depot");
				fs.writeFileSync(__dirname + '/../storage/' + identifier + '.depot',JSON.stringify(depot));
			}

			depot.buy = function(stockData,amount,success,fail) {
				var successCallback = success || function(){};
				var failCallback = fail || function(){};

				if(this.bank.money > stockData.ask * amount) {
					this.bank.money -= (amount * stockData.ask);
					this.bank.hold += amount;
					fs.writeFileSync(__dirname + '/../storage/' + this.id + '.depot',JSON.stringify(depot));
					successCallback(depot);
					return
				}

				failCallback(depot);
			};

			depot.sell = function(stockData,amount,success,fail) {
				var successCallback = success || function(){};
				var failCallback = fail || function(){};

				if(this.bank.hold > 0) {
					this.bank.money += (amount * stockData.bid);
					this.bank.hold -= amount;
					fs.writeFileSync(__dirname + '/../storage/' + this.id + '.depot',JSON.stringify(depot));
					successCallback(depot);
					return
				}

				failCallback(depot);
			};

			depot.tick = tickFunction;
			depot.init = initFunction;
			
			depots.push(depot);
		}
	}
}