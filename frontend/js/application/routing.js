app.config(function($routeProvider){
	$routeProvider
	.when("/",{
		templateUrl: "views/depotList.html"
	})
	.otherwise({redirectTo: '/'});
});