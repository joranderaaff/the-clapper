var controlLightsControllers = angular.module('controlLightsControllers', []);

controlLightsControllers.controller('ControlLightsStateController', ['$scope', '$rootScope', '$http', '$routeParams', '$location',
	function ($scope, $rootScope, $http, $routeParams, $location)
	{
		if(!bridgeUser) {
			$location.path("/");
			return;
		}
		
		$scope.volume = 0;
		$scope.playing = false;
		
		var ctrl = this;
		var timeSinceLastPeak = 0;
		var audio;
		
		console.log(navigator.mediaDevices);
		navigator.mediaDevices.getUserMedia({audio: true})
		.then(success)
		.catch(function(error) {
			console.log(error);
		});

		//navigator.getUserMedia({audio: true}, success, function(e) {
			//console.log("error");
		//});
		
		this.stop = function() {
			audio.pause();
			$scope.playing = false;
		}
		
		function success(stream){
			// creates the audio context
			var context = new AudioContext();

			// retrieve the current sample rate to be used for WAV packaging
			var sampleRate = context.sampleRate;

			// creates a gain node
			var volume = context.createGain();
			
			// high pass
			var filter = context.createBiquadFilter();
			// Create the audio graph.
			// Create and specify parameters for the low-pass filter.
			filter.type = 'highpass'; // Low-pass filter. See BiquadFilterNode docs
			filter.frequency.value = 5000; // Set cutoff to 440 HZ
			
			// creates an audio node from the microphone incoming stream
			var audioInput = context.createMediaStreamSource(stream);

			/* From the spec: This value controls how frequently the audioprocess event is 
			dispatched and how many sample-frames need to be processed each call. 
			Lower values for buffer size will result in a lower (better) latency. 
			Higher values will be necessary to avoid audio breakup and glitches */
			var bufferSize = 2048;
			var recorder = context.createScriptProcessor(bufferSize, 1, 1);
			
			audioInput.connect(volume);
			
			volume.connect(filter);
			
			filter.connect(recorder);
			
			recorder.connect(context.destination);
			
			recorder.onaudioprocess = handleAudioProcesfunction;
		}
		
		function handleAudioProcesfunction(e)
		{
			var inputData = e.inputBuffer.getChannelData(0);
			var outputData = e.outputBuffer.getChannelData(0);
			
			var maxSample = 0;
			
			for (var sample = 0; sample < e.inputBuffer.length; sample++) {
				// make output equal to the same as the input
				//console.log(inputData[sample]);
				outputData[sample] = 0;
				
				maxSample = Math.max(maxSample, inputData[sample]);
				
				if(inputData[sample] > 0.5) {
					var d = new Date();
					var n = d.getTime();
					var diff = n - timeSinceLastPeak;
					timeSinceLastPeak = n;
					if(!$scope.playing && diff > 200 && diff < 500)
					{
						console.log("CLAP");
						$scope.playing = true;
						
						audio = new Audio('mp3/song.mp3');
						audio.play();
						
						dimLights();
						
						//var btn = $("<input>");
						//btn.attr("type", "button");
						//btn.attr("value", "Stop");
						//btn.click(_handleStopClicked);
						//$(document.body).append(btn);
					}
				}
			}
			$scope.volume = Math.min(1, maxSample);
			$scope.$apply();
		}
		
		function dimLights()
		{
			for(var i = 0; i < $rootScope.selectedLights.length; i++) {
				var lightId = $rootScope.selectedLights[i];
				bridgeUser.setLightState(lightId, { transitiontime: 15, on: true, hue: 0, bri: 127, sat: 255});
			}
		}
	}
]);