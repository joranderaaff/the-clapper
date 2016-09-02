var lightSelectionControllers = angular.module('lightSelectionControllers', []);

lightSelectionControllers.controller('LightSelectionStateCtrl', ['$scope', '$rootScope', '$http', '$routeParams', '$location',
	function ($scope, $rootScope, $http, $routeParams, $location)
	{
		if(!bridgeUser) {
			$location.path("/");
			return;
		}
		
		bridgeUser.getLights(_handleLightsLoaded);
		
		var ctrl = this;
		
		function _handleLightsLoaded(lights)
		{
			$rootScope.lights = lights;
			
			$scope.lightSelectModel = {};
			$scope.lights = [];
			
			ctrl.lightById = {};
			
			for(lightId in lights) {
				var light = lights[lightId];
				
				if((light.type == "Color light" || light.type == "Extended color light") && light.state.reachable) {
					$scope.lightSelectModel[light.uniqueid] = false;
					$scope.lights.push(light);
					ctrl.lightById[light.uniqueid] = lightId;
				}
			}
			
			$scope.$apply();
		}
		
		this.chooseLights = function()
		{
			var lights = $scope.lights;
			var selectedLights = [];
			for(uniqueid in $scope.lightSelectModel) {
				var lightSelected = $scope.lightSelectModel[uniqueid];
				if(lightSelected) {
					var lightId = ctrl.lightById[uniqueid];
					selectedLights.push(lightId);
				} 
			}
			if(selectedLights.length == 0) {
				$scope.noSelectedLightsWarning = true;
			} else {
				$rootScope.selectedLights = selectedLights;
				$location.path("/control");
			}
		}
	}
]);