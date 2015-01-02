var srsApp = angular.module('srsApp',['ngRoute']);
var apiurl = "http://api.swissrugbystats.ch";

// Routing
srsApp.config(function ($routeProvider){
	$routeProvider
		.when('/',
		{
			redirectTo: '/team/42'
			//controller : 'SimpleController',
			//templateUrl : 'views/view1.htm'
		})
		.when('/team/:teamId',
		{
			controller : 'SwissRugbyStatsController',
			templateUrl : 'views/team.htm'
		})
		.otherwise({ redirectTo: '/' });
});


function SwissRugbyStatsController($scope, $routeParams, $filter, $http) {
	
	if ($routeParams != '') {
		$scope.params = $routeParams;
		$scope.teamId = $routeParams.teamId;
	}

	$scope.games = {};
	$scope.teams = {};
	$http.get(apiurl+'/games/.json').
        success(function(data) {
            $scope.games = data;
    });
    $http.get(apiurl +'/teams/.json').
    success(function(data) {
        $scope.teams = data;
    });

	$scope.gameParticipantFilter = function (game) {
		if ($scope.team1 && $scope.team2) {
	    	return ((game.host.team.id == $scope.team1.id ||
	    			game.host.team.id == $scope.team2.id) &&
	    			(game.guest.team.id == $scope.team1.id ||
	    			game.guest.team.id == $scope.team2.id));
	    } else if ($scope.teamId){
	    	return (game.host.team.id == $scope.teamId ||
	    			game.guest.team.id == $scope.teamId);
	    } else {
	    	return $scope.games;
	    }
	}
}

srsApp.controller('SwissRugbyStatsController', SwissRugbyStatsController);