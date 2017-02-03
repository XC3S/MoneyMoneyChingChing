app.factory('$depot',function($socket){
	var depots = [{
		'id':'mocked depot' 
	}];

	$socket.on('receiveDepotData',function(data){
		depots = data || [];
	});

	return {
		getDepots: function(){
			return depots;
		}
	}
});