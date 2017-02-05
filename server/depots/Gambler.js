module.exports = atlas;

var _ = require('underscore-node')

function atlas(depotManager,globalSettings){
	var options = {
		actionOffset: 0.0005,
		actionVolume: 0.05,
		targetProfit: 2,//€
		increase: 1.25
	};

	// extend options with global options
	options = _.extend(options,globalSettings);

	depotManager.createDepot(
		'Gambler',
		'Start With a 5% invest and reinvest more on every 5pid change. Each step is 25% bigger then the one before. Sell all if you reach a fixed profit of 2€.',
		options,
		function(stockData){
			// tick function
	    	//console.log("tick",stockData.bid);

	    	if(stockData.ask < this.storage.nextEntry) {
	    		//var amount = 100; //@TODO: implement amount

	      		var amount = this.storage.lastVolume / stockData.ask;
	      		 
	      		this.buy(stockData,amount,function(scope){
	        		// console.log("scope:",JSON.stringify(scope));
	        		// success  
	        		scope.storage.totalInvest += stockData.ask * amount;
			        scope.storage.nextEntry = stockData.ask * (1 - options.actionOffset);
			        scope.storage.nextExit = (scope.storage.totalInvest + options.targetProfit) / scope.bank.hold ;
			        //console.log('buy(amount:', amount , ') - money: ',scope.bank.money);
			        console.log("buy : ",JSON.stringify(scope));

	    		},function(scope){
	        		// failed... sell all... try it again
	        		scope.storage.totalInvest -= amount * stockData.bid;
	        		scope.storage.totalInvest = (scope.storage.totalInvest < 0) ? 0 : scope.storage.totalInvest;
	        		scope.storage.nextEntry = stockData.ask * (1 - options.actionOffset);
	        		scope.storage.nextExit = stockData.ask * (1 + options.actionOffset);
	        		console.log('failed - im done :/');
	     		});
			}

	    	if(stockData.bid > this.storage.nextExit) {
	      		//var amount = 100; // @TODO: implement amount
	    		var amount = this.bank.hold;

	    		this.sell(stockData,amount,function(scope){
	    			// success
	        		scope.storage.totalInvest -= amount * stockData.bid;
	        		scope.storage.totalInvest = (scope.storage.totalInvest < 0) ? 0 : scope.storage.totalInvest;
	        		scope.storage.nextEntry = stockData.ask * (1 - options.actionOffset);
	        		scope.storage.nextExit = stockData.ask * (1 + options.actionOffset);
	        		//console.log('sell(amount:', amount ,') - total: ',scope.bank.money);

					scope.storage.lastVolume = (options.startMoney * options.actionVolume) / options.increase;

	        		console.log("sell : ",JSON.stringify(scope));
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

		    // initial value is smaller than the initial trade value in order to be the same after the increase
		    this.storage.lastVolume = (options.startMoney * options.actionVolume) / options.increase;
			
	    	//console.log('nextEntry',this.storage.nextEntry);
	    	//console.log('nextExit',this.storage.nextExit);
	    	console.log("Initialized " + this.id + " at ", stockData.ask);
		}
	);
}