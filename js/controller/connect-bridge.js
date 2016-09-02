var connectBridgeControllers = angular.module('connectBridgeControllers', []);

connectBridgeControllers.controller('ConnectionStateCtrl', ['$scope', '$rootScope', '$http', '$routeParams', '$location',
	function ($scope, $rootScope, $http, $routeParams, $location)
	{
		var scope = $scope;
		
		$scope.connecting = true;
		
		if(typeof(Storage) !== "undefined"){
			if(!localStorage.internalip) {
				hue.discover(
					handleBridgesFound
				);
			} else {
				console.log("using stored ip: " + localStorage.internalip);
				tryBridgeAvailability(localStorage.internalip);
			}
		}
		
		function handleBridgesFound(bridges)
		{
			if(bridges.length === 0) {
				console.log("no bridges found");
				$scope.noBridges = true;
				$scope.$apply();
			}
			else {
				var bridgeData = bridges[0];
				localStorage.internalip = bridgeData.internalipaddress;
				tryBridgeAvailability(bridgeData.internalipaddress);
			}
		}
		
		function tryBridgeAvailability(ip)
		{
			console.log("tryBridgeAvailability("+ip+")");
			bridge = hue.bridge(ip);
			bridge.getConfig(connectToBridge, tryBridgeError);
		}
		
		function tryBridgeError(data)
		{
			console.log(data);
			$scope.noConnection = true;
			$scope.$apply();
		}
		
		function connectToBridge(data)
		{
			console.log(data);
			$scope.connected = true;
			$scope.connecting = false;
			
			if(!localStorage.username) {
				_createUser();
			} else {
				console.log("username from Storage " + localStorage.username);
				bridgeUser = bridge.user(localStorage.username);
				$scope.userCreated = true;
				$scope.$apply();
			}
		}
		
		function _createUser()
		{
			// create user account (requires link button to be pressed)
			bridge.createUser('weerwolven#pcjoran', handleUserCreated, handleUserCreateError);
		}
		
		this.retryUserCreation = function()
		{
			$scope.pressButton = false;
			_createUser();
		}
		
		function handleUserCreated(data)
		{
			var result = data[0];
			
			if(result.error) {
				if(result.error.type == 101) {
					scope.pressButton = true;
					$scope.$apply();
				}
			} else {
				$scope.userCreated = true;
				//$scope.$apply();
				// extract bridge-generated username from returned data
				var username = data[0].success.username;
				localStorage.username = username;
				// instantiate user object with username
				bridgeUser = bridge.user(username);
				$scope.$apply();
			}
		}
		
		function handleUserCreateError(error)
		{
			console.log(error);
		}
		
		this.goToLightSelect = function()
		{
			$location.path("/lights");
		}
	}
]);