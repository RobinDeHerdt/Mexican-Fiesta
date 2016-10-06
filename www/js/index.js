var accelerationX = 0;
var accelerationY = 0;
var accelerationZ = 0;

var app = {
  initialize: function() {
    this.bindEvents();
  },

  bindEvents: function() {
    document.addEventListener('deviceready', app.onDeviceReady, false);
  },

  onDeviceReady: function() {
    app.receivedEvent('deviceready');
    app.startWatch();
  },

  receivedEvent: function(id) {
    var parentElement = document.getElementById(id);
    var listeningElement = parentElement.querySelector('.listening');
    var receivedElement = parentElement.querySelector('.received');

    listeningElement.setAttribute('style', 'display:none;');
    receivedElement.setAttribute('style', 'display:block;');

    console.log('Received Event: ' + id);
  },

  startWatch: function() {
    var options = { frequency: 100 };

    watchID = navigator.accelerometer.watchAcceleration(app.accelerometerSucces, app.accelerometerError, options);
  },

  accelerometerSucces: function(acceleration) {
    var element = document.getElementById('accelerometerDiv');

    accelerationX = acceleration.x;
    accelerationY = acceleration.y;
    accelerationZ = acceleration.z;

  },

  accelerometerError: function() {
    alert('onError!');
  }
};