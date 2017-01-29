module.exports = depotInitializer;

var _ = require('underscore-node')

function depotInitializer(depotManager){

	var options = {
		actionOffset: 0.0003,
		actionVolume: 0.1
	};

	var globalSettings = {
		spread: 0.00018,
		startMoney: 10000,
		leverage: 50
	};

	// extend options with global options
	options = _.extend(options,globalSettings);

	depotManager.createDepot(
		'DynamicScaling10Step',
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
}