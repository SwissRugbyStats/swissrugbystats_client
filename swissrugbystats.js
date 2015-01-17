var srsApp = angular.module('srsApp',['ngRoute']);
//var apiurl = "http://api.swissrugbystats.ch";
var apiurl = "http://127.0.0.1:8000";

srsApp.setAuthorizationHeader = function($http, $window, token){
	$window.sessionStorage.token = token;

  	if(token != "undefined" && token != undefined) {
		console.log("logged in");
		$('#nav-item-login').hide();
		$('#nav-item-profile').show();
		$('#nav-item-logout').show();
		$http.defaults.headers.common.Authorization = 'JWT '+token;
		console.log("set http header: " + $http.defaults.headers.common.Authorization);
	} else {
		$('#nav-item-login').show();
		$('#nav-item-profile').hide();
		$('#nav-item-logout').hide();
		$http.defaults.headers.common.Authorization = undefined;
		console.log("reset http header");
	}
};

srsApp.resetAuthorizationHeader = function($http, $window){
	srsApp.setAuthorizationHeader($http, $window, "undefined");
  	
};

srsApp.run(function($http, $window) {
	srsApp.setAuthorizationHeader($http, $window, $window.sessionStorage.token);
});



// Routing
srsApp.config(function ($routeProvider){
	$routeProvider
		.when('/',
		{
			templateUrl : 'views/index.html'
		})
		.when('/leagues',
		{
			controller : 'LeagueController',
			templateUrl : 'views/leagues.html'
		})
		.when('/leagues/:leagueId',
		{
			controller : 'LeagueController',
			templateUrl : 'views/league.html'
		})
		.when('/venues',
		{
			controller : 'VenueController',
			templateUrl : 'views/venues.html'
		})
		.when('/venues/:venueId',
		{
			controller : 'VenueController',
			templateUrl : 'views/venue.html'
		})
		.when('/games',
		{
			controller : 'SwissRugbyStatsController',
			templateUrl : 'views/games.html'
		})
		.when('/games/:gameId',
		{
			controller : 'GameController',
			templateUrl : 'views/game.html'
		})
		.when('/teams',
		{
			controller : 'SwissRugbyStatsController',
			templateUrl : 'views/teams.html'
		})
		.when('/teams/:teamId',
		{
			controller : 'SwissRugbyStatsController',
			templateUrl : 'views/team.html'
		})
		.when('/referees',
		{
			controller : 'RefereeController',
			templateUrl : 'views/referees.html'
		})
		.when('/about',
		{
			templateUrl : 'views/about.html'
		})
		.when('/login',
		{
			controller : 'LoginController',
			templateUrl : 'views/login.html'
		})
		.when('/profile',
		{
			controller : 'ProfileController',
			templateUrl : 'views/profile.html'
		})
		.otherwise({ redirectTo: '/' });
});


function SwissRugbyStatsController($scope, $routeParams, $filter, $http) {
	
	$scope.teams = {};
	$scope.sidebar = {};
	if (Object.keys($routeParams).length != 0) {
		$scope.params = $routeParams;
		$scope.teamId = $routeParams.teamId;
		$http.get(apiurl +'/teams/'+$scope.teamId+'/.json').
    	success(function(data) {
	        $scope.team = data;
    	});
    	$scope.sidebar = "test";
    	console.log($scope.sidebar);
	} else {
		$http.get(apiurl +'/teams/.json').
    	success(function(data) {
        	$scope.teams = data;
    	});
	}

	$scope.games = {};
	$http.get(apiurl+'/games/.json').
        success(function(data) {
            $scope.games = data;
    });

    $scope.addFavorite = function() {
    	// TODO: check if logged in, otherwise provide link to login / register page
    	if (window.sessionStorage.token) {
			var params = { "team" : $scope.team.id, "user" : 1 }
    		console.log(params)
    		$http.post(apiurl+'/favorites/', params).
       			success(function(data, staus, header) {
         			console.log("Favorite added.")
         			$scope.success = $scope.team.name +" added to favorites";
    			}).
    			error(function(data, status) {
    				if (status === 409) {
    					console.log("Already favorited");
    					$scope.info = $scope.team.name +" already added to favorites";
    				} else {
    					console.log("Error adding favorite: "+status)
    					$scope.error = "There was an error when trying to add "+ $scope.team.name +" to favorites";
    				}
    			});
    	} else {
    		$scope.info = "You need to log in to be able to save favorites."
    	}

    	$('#nav-item-login').hide();
		$('#nav-item-profile').show();
		$('#nav-item-logout').show();
    }
    

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
	
	$scope.sidebar = {};
	$scope.referees = {};

	$http.get(apiurl+'/referees/.json')
        .success(function(data) {
            $scope.referees = data;
    	})
    	.error(function(data) {
    		console.log("error" + data.detail);
    	});
}

function LeagueController($scope, $routeParams, $filter, $http) {
	
	$scope.sidebar = {};
	$scope.leagues = {};
	if (Object.keys($routeParams).length != 0) {
		$http.get(apiurl+'/leagues/'+$routeParams.leagueId).
	        success(function(data) {
	            $scope.league = data;
	    	}).
	    	error(function(data, status) {
	    		console.log("error: " + status);
	    	});
	} else {
		$http.get(apiurl+'/leagues/.json').
	        success(function(data) {
	            $scope.leagues = data;
	    });
	}

}

function VenueController($scope, $routeParams, $filter, $http) {
	
	$scope.sidebar = {};
	$scope.venues = {};
	if (Object.keys($routeParams).length != 0) {
		$scope.venueId = $routeParams.venueId;
		$http.get(apiurl+'/venues/'+$scope.venueId+'/.json').
			success(function(data) {
	            $scope.venue = data;
	    });
	} else {
		$http.get(apiurl+'/venues/.json').
	        success(function(data) {
	            $scope.venues = data;
	    });
	}
}

function LoginController($scope, $routeParams, $filter, $http, $window, $rootScope) {
	
	$scope.sidebar = {};
	$scope.venues = {};

	if($routeParams.logout==1) {
		console.log("logout");
		srsApp.resetAuthorizationHeader($http,$window);
		window.sessionStorage.username = undefined;
		window.sessionStorage.id = undefined;
	}

	/* Login function, called by login form */
	$scope.getAuthToken = function() {

		$rootScope.username = $scope.user.username;
		$http.post(apiurl+'/api-token-auth/', $scope.user)
		    .success(function(data, status, headers, config) {
		       $scope.token = data.token;
		       srsApp.setAuthorizationHeader($http, $window, data.token);
		       window.sessionStorage.username = $scope.user.username;
		       console.log("successfully logged in");
		       window.location.href = '#/profile';
		    })
		    .error(function(data, status, headers, config) {
		    	console.log("error logging in: " + status);
		    	$scope.loginError = "Error logging in. Recheck username and password."
		    });
	}

	$scope.createUser = function() {
		console.log(JSON.stringify($scope.user));
		$http.post(apiurl+'/users/', $scope.user).
	        success(function(data) {
	            $scope.game = data;
	            console.log("success! "+JSON.stringify(data));
	    	}).
	    	error(function(status, data) {
	    		console.log("error: " + JSON.stringify(status));
	    	});
	}
}

function ProfileController($scope, $routeParams, $filter, $http, $window, $rootScope) {
	$http.get(apiurl + "/favorites/.json").
		success(function(data) {
			$scope.favorites = data;
			$scope.userId = window.sessionStorage.id;
			$scope.username = window.sessionStorage.username;
		}).
		error(function(data, status){
			console.log("eror: "+status);
		})
}

function GameController($scope, $routeParams, $filter, $http) {
	
	$scope.sidebar = {};
	$scope.gameId = $routeParams.gameId;

	$scope.game = {};
	$http.get(apiurl+'/games/'+$scope.gameId+'/.json').
        success(function(data) {
            $scope.game = data;
            $scope.team1 = $scope.game.host.team;
    		$scope.team2 = $scope.game.guest.team;
    });

    // TODO: merge with SwissRugbyController
    $scope.games = {};
	$http.get(apiurl+'/games/.json').
        success(function(data) {
            $scope.games = data;
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
	$scope.areNotEqual = function (actual, expected) {
		return actual !== expected;
	}
}

srsApp.controller('SwissRugbyStatsController', SwissRugbyStatsController);
srsApp.controller('RefereeController', RefereeController);
srsApp.controller('LeagueController', LeagueController);
srsApp.controller('VenueController', VenueController);
srsApp.controller('GameController', GameController);
srsApp.controller('LoginController', LoginController);
srsApp.controller('ProfileController', ProfileController);

srsApp.run(function($rootScope, $location, $anchorScroll, $routeParams) {
  //when the route is changed scroll to the proper element.
  $rootScope.$on('$routeChangeSuccess', function(newRoute, oldRoute) {
    $location.hash($routeParams.scrollTo);
    $anchorScroll();  
  });
});