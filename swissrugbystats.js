var srsApp = angular.module('srsApp',['ngRoute']);
var apiurl = "http://api.swissrugbystats.ch";

// Routing
srsApp.config(function ($routeProvider){
	$routeProvider
		.when('/',
		{
			redirectTo: '/leagues'
		})
		.when('/leagues',
		{
			controller : 'LeagueController',
			templateUrl : 'views/leagues.html'
		})
		.when('/venues',
		{
			controller : 'VenueController',
			templateUrl : 'views/venues.html'
		})
		.when('/games',
		{
			controller : 'SwissRugbyStatsController',
			templateUrl : 'views/games.html'
		})
		.when('/teams',
		{
			controller : 'SwissRugbyStatsController',
			templateUrl : 'views/teams.html'
		})
		.when('/team/:teamId',
		{
			controller : 'SwissRugbyStatsController',
			templateUrl : 'views/team.html'
		})
		.when('/referees',
		{
			controller : 'RefereeController',
			templateUrl : 'views/referees.html'
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

    // custom filters
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
	$scope.exactMatch = function (team) {
		return team.id == $scope.teamId;
	}
}

function RefereeController($scope, $routeParams, $filter, $http) {
	
	$scope.referees = {};
	$http.get(apiurl+'/referees/.json').
        success(function(data) {
            $scope.referees = data;
    });
}

function LeagueController($scope, $routeParams, $filter, $http) {
	
	$scope.leagues = {};
	$http.get(apiurl+'/leagues/.json').
        success(function(data) {
            $scope.leagues = data;
    });
}

function VenueController($scope, $routeParams, $filter, $http) {
	
	$scope.venues = {};
	$http.get(apiurl+'/venues/.json').
        success(function(data) {
            $scope.venues = data;
    });
}

srsApp.controller('SwissRugbyStatsController', SwissRugbyStatsController);
srsApp.controller('RefereeController', RefereeController);
srsApp.controller('LeagueController', LeagueController);
srsApp.controller('VenueController', VenueController);