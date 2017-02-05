var depotListController = function($scope,$depot){
	$scope.getDepots = function(){
		return $depot.getDepots();
	}

	$scope.getCurse = function(){
		return $depot.getCurse();
	}
}

app.controller("depotListController",depotListController);
depotListController.$inject = ["$scope","$depot"];