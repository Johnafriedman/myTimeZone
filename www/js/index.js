
var myTimeZone = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        myTimeZone.render();
    },

    render: function(){
        var paper = Raphael(10, 50, 320, 200);
        var c = paper.circle(50, 50, 40);
    }

};

myTimeZone.initialize();


// Draw circle

// indicate direction in degrees 0 North

// indicate sunrise and sunset point in degrees

// draw noon radius perpendicular to line connecting sunrise and sunset

// indicate noon sun position on radius using altitude