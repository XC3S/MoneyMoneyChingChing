module.exports = depotManager();

function depotManager(){
	var depots = [];

	var globalSettings = {
		spread: 0.00018,
		startMoney: 10000,
		leverage: 50
	};

	console.log("init depotManager");

	return {
		tick: function(value){
			var stockData = {
				bid: value,
				ask: value + globalSettings.spread	// forex trading platform like tradeking use a custom spread instead of an comision
			}

			depots.forEach(function(entry){
				if(!entry.storage.initialized) {
					entry.init(stockData);
					entry.storage.initialized = true;
				} 
				else {
					entry.tick(stockData);
				}
			});
		},
		getDepots: function(){
			return depots
		},
		createDepot: function(identifier,options,tickFunction,initFunction){
			var depot = {
				id: identifier,
				bank: {
					money: globalSettings.startMoney,
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
					successCallback();
					return
				}

				failCallback();
			};

			depot.sell = function(stockData,amount,success,fail) {
				var successCallback = success || function(){};
				var failCallback = fail || function(){};

				if(this.bank.hold > 0) {
					this.bank.money += (amount * stockData.bid);
					this.bank.hold -= amount;
					successCallback();
					return
				}

				failCallback();
			};

			depot.tick = tickFunction;
			depot.init = initFunction;
			
			depots.push(depot);
		}
	}
}