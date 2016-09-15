angular.module('srsApp')

.controller('TeamController', ['$routeParams', '$filter', '$http', '$scope', function($routeParams, $filter, $http, $scope) {
	// show loading spinner
	$('.loading-spinner').show();

	// initiate scope variables
	$scope.teams = {};
	$scope.sidebar = {};

	// check if team list or team detail
	if (Object.keys($routeParams).length !== 0) {
		$scope.params = $routeParams;
		$scope.teamId = $routeParams.teamId;

		// get team details
		$http.get(apiurl +'/teams/'+$scope.teamId+'.json', { cache: true } )
	    	.success(function(data) {
		        $scope.team = data;
		        $('.loading-spinner').hide();
	    	});
    	$scope.sidebar = 'test';
    	console.log($scope.sidebar);
	} else {
		// get team list
		$http.get(apiurl +'/teams.json', { cache: true } ).
    	success(function(data) {
        	$scope.teams = data;
    	});
	}

	$scope.games = {};
	// get games
	$http.get(apiurl+'/teams/'+$scope.teamId+'/games.json', { cache: true } ).
        success(function(data) {
            $scope.games = data;
    });
}]);