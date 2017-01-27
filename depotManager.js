module.exports = depotManager();

function depotManager(){
	var depots = [];

	return {
		tick: function(value){

		},
		getDepots: function(){
			return depots
		}
	}
}