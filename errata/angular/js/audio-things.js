
var audioApp = angular.module("AudioUploader", ['ngRoute']);

var controllers = {};


audioApp.config(function($routeProvider){
    $routeProvider
        .when('/', {
            controller: 'uploadController',
            templateUrl: 'upload.html'
        })
        .when('/analysis', {
            controller: 'analysisController',
            templateUrl: 'analysis.html'
        })
        .otherwise({ redirectTo: '/'});
});

controllers['uploadController'] = function uploadController($scope) {
    $scope.audioFiles = [];
    $scope.context = new AudioContext();
    $scope.sourceBuffer = $scope.context.createBufferSource();

    //drawing the waveform
    $scope.analyser = $scope.context.createAnalyser();
    $scope.drawVisual;
    $scope.analyser.fftSize = 2048; //change transfer size
    $scope.bufferLength = $scope.analyser.frequencyBinCount; //setting the number of bins
    $scope.dataArray = new Uint8Array($scope.bufferLength);
    $scope.analyser.getByteTimeDomainData($scope.dataArray);
    $scope.canvas = document.getElementById('waveform');
    $scope.canvasCtx = $scope.canvas.getContext("2d");
    $scope.upload = function() {
        debugger;
        var url = $('input .file');
        var request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.responseType = 'arraybuffer';

        // Decode asynchronously
        request.onload = function() {
            context.decodeAudioData(request.response, function(theBuffer) {
                buffer = theBuffer;
            }, onError);
        };
        request.send();
    };

    $scope.analyze = function() {
        var file =  $('#songs li').html();
        var request = new XMLHttpRequest();
        //var context = new AudioContext();
        //var sourceBuffer = context.createBufferSource();
        var onError = function() {};
        request.open('GET', file, true);
        request.responseType = 'arraybuffer';

        request.onload = function() {
            $scope.context.decodeAudioData(request.response, function(theBuffer){
                //var sourceBuffer = context.createBufferSource();

                $scope.sourceBuffer.buffer = theBuffer;
                $scope.sourceBuffer.connect($scope.context.destination);
                //sourceBuffer.start(context.currentTime);
            }, onError);
        };
        request.send();
    };

    $scope.start = function() {

        $scope.canvasCtx.clearRect(0,0,400,200);
        $scope.sourceBuffer.start($scope.context.currentTime);
        $scope.draw();
        //$scope.bargraph();
    };

    $scope.stop = function() {
        $scope.sourceBuffer.stop();
    };

    //todo: won't render the waveform
    $scope.draw = function() {
        var HEIGHT = 200,
            WIDTH = 400;


        console.log("test");
        function visualize() {
           // console.log("test");
            $scope.drawVisual = requestAnimationFrame(visualize);
            $scope.analyser.getByteTimeDomainData($scope.dataArray);
            $scope.canvasCtx.fillStyle = 'rgb(200, 200, 200)';
            $scope.canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
            $scope.canvasCtx.lineWidth = 2;
            $scope.canvasCtx.strokeStyle = 'rgb(0, 0, 0)';

            $scope.canvasCtx.beginPath();

            var sliceWidth = WIDTH * 1.0 / $scope.bufferLength;
            var x = 0;

            for (var i = 0; i < $scope.bufferLength; i++) {

                var v = $scope.dataArray[i] / 128.0;
                var y = v * HEIGHT / 2;

                if (i === 0) {
                    $scope.canvasCtx.moveTo(x, y);
                } else {
                    $scope.canvasCtx.lineTo(x, y);
                    console.log("oscillicoordinates: " + x + ", "+ y);
                }

                x += sliceWidth;
            }

            $scope.canvasCtx.lineTo($scope.canvas.width, $scope.canvas.height / 2);
            //console.log("Width="+$scope.canvas.width + " height="+ $scope.canvas.height / 2);
            $scope.canvasCtx.stroke();
        }

        visualize();
    };

    //todo: won't render the bargraph
    $scope.bargraph = function () {
        $scope.analyser.fftSize = 256;
        var bufferLength = $scope.analyser.frequencyBinCount;
        var drawVisual;

        console.log(bufferLength);
        var dataArray = new Uint8Array(bufferLength);

        var canvas = document.getElementById('bargraph');
        var canvasCtx = canvas.getContext("2d");
        var HEIGHT = canvas.height;
        var WIDTH = canvas.width;
        function draw() {
            drawVisual = requestAnimationFrame(draw);
            $scope.analyser.getByteTimeDomainData($scope.dataArray);

            canvasCtx.fillStyle = 'rgb(0,0,0)';
            canvasCtx.fillRect(0,0, 400, 200);

            var barWidth = (WIDTH / bufferLength) * 2.5;
            var barHeight;


            var x = 0;

            for(var i = 0; i < bufferLength; i++) {
                barHeight = dataArray[i]/2;

                canvasCtx.fillStyle = 'rgb(' + (barHeight+100) + ',50,50)';
                canvasCtx.fillRect(x,HEIGHT-barHeight/2,barWidth,barHeight);
                //console.log("barheight: " + barHeight);
                x += barWidth + 1;
            }
        }

        draw();

    };

};

audioApp.controller(controllers);