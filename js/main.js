window.AudioContext = window.AudioContext || window.webkitAudioContext;
//navigator.getUserMedia = (
	//navigator.getUserMedia ||
	//navigator.webkitGetUserMedia ||
	//navigator.mozGetUserMedia ||
	//navigator.msGetUserMedia
//);
//
//if(navigator.mediaDevices) {
	//navigator.getUserMedia = (navigator.getUserMedia || navigator.mediaDevices.getUserMedia);
//}

window.URL = window.URL || window.webkitURL;

var hue = jsHue();
var bridge;
var bridgeUser;

//localStorage.clear();

var beerApp = angular.module('weerwolvenApp', [
	'ngRoute',
	'connectBridgeControllers',
	'controlLightsControllers',
	'lightSelectionControllers'
]);

beerApp.config(['$routeProvider',
	function($routeProvider)
	{
		$routeProvider.
		when('/connect', {
			templateUrl: 'partials/connect-bridge.html',
			controller: 'ConnectionStateCtrl',
			controllerAs: 'ctrl'
		}).
		when('/lights', {
			templateUrl: 'partials/lights-selection.html',
			controller: 'LightSelectionStateCtrl',
			controllerAs: 'ctrl'
		}).
		when('/control', {
			templateUrl: 'partials/control-lights.html',
			controller: 'ControlLightsStateController',
			controllerAs: 'ctrl'
		}).
		otherwise({
			redirectTo: '/connect'
		});
	}
]);