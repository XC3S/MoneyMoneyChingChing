module.exports = depotManager();

function depotManager(){
	var depots = [];

	console.log("init depotManager");

	var tickCallbacks = [];

	return {
		tick: function(value){
			depots.forEach(function(entry){
				var stockData = {
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
		createDepot: function(identifier,options,tickFunction,initFunction){
			var depot = {
				id: identifier,
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

			depot.buy = function(stockData,amount,success,fail) {
				var successCallback = success || function(){};
				var failCallback = fail || function(){};

				if(this.bank.money > stockData.ask * amount) {
					this.bank.money -= (amount * stockData.ask);
					this.bank.hold += amount;
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