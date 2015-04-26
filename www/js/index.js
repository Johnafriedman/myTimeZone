
var myTimeZone = {

    position: {},
    paper: null,

    initialize: function() {
        _.bindAll(this);
        myTimeZone.render();
        myTimeZone.getLocation();
    },

    render: function(){
        this.paper = Raphael(10, 50, 1024, 768);
        var c = this.paper.circle(50, 50, 40);
        var path = this.paper.text(10, 10, "hello");;
        this.paper.path(path);

    },

    getLocation: function(){
        navigator.geolocation.getCurrentPosition(this.onGPSSuccess, this.onGPSError);
    },

    onGPSSuccess: function(position){
        this.position = position;
        // alert('Latitude: '          + position.coords.latitude          + '\n' +
        //       'Longitude: '         + position.coords.longitude         + '\n' +
        //       'Altitude: '          + position.coords.altitude          + '\n' +
        //       'Accuracy: '          + position.coords.accuracy          + '\n' +
        //       'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
        //       'Heading: '           + position.coords.heading           + '\n' +
        //       'Speed: '             + position.coords.speed             + '\n' +
        //       'Timestamp: '         + position.timestamp                + '\n');
        var result = SunCalc.getTimes(new Date(),position.coords.latitude, position.coords.longitude);
        var s="";
        _.forEach(result, function(d,k){
            s=s+k+":"+d+"\n";

        });
        var path = this.paper.text(200, 100, s);
    },

    onGPSError: function(error){
        alert('code: '    + error.code    + '\n' +
              'message: ' + error.message + '\n');
    }

};

document.addEventListener('deviceready', myTimeZone.initialize(), false);

// determine latitude

// Draw circle

// indicate direction in degrees 0 North

// indicate sunrise and sunset point in degrees

// draw noon radius perpendicular to line connecting sunrise and sunset

// indicate noon sun position on radius using altitude