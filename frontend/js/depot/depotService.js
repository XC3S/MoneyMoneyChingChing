app.factory('$depot',function($socket){
	var depots = [];
	var curse = {};

	$socket.on('receiveDepotData',function(data){
		depots = data.depots || [];
		curse = data.curse || {};
	});

	return {
		getDepots: function(){
			return depots;
		},
		getCurse: function(){
			return curse;
		}
	}
});