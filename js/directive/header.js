angular.module('beerHeader', [])

.controller('headerController', ['$scope', '$window',
	function($scope, $window) {
		this.back = function()
		{
			$window.history.back();
		}
	}
])

.directive('header',
	function() {
		return {
			controllerAs: 'ctrl',
			controller: 'headerController',
			templateUrl: 'partials/header.html'
		};
	}
);