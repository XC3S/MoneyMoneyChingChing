var depotController = function($scope,$depot){
	$scope.getDepots = function(){
		return $depot.getDepots();
	}
}

app.controller("depotController",depotController);
depotController.$inject = ["$scope","$depot"];