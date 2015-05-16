
var myTimeZone = {

  position: {},
  times: {},
  offset: 0,
  paper: null,

  initialize: function() {
    _.bindAll(this);
    this.paper = Raphael(10, 50, 1024, 768);
    myTimeZone.getLocation();
  },

  render: function(){
    this.paper.clear();
    var c = this.paper.circle(50, 50, 40);
    var s="";
    _.forEach(this.times, function(d,k){
        s=s+k+":"+d+"\n";

    });
    this.paper.text(200, 100, s);

  },

  getLocation: function(){
    this.paper.text(200, 100, "identifying location");
    navigator.geolocation.getCurrentPosition(this.onGPSSuccess, this.onGPSError);
  },

  onGPSSuccess: function(position){
    this.position = position;
    this.calculateTimes();
    this.render();
  },

  onGPSError: function(error){
    alert('code: '    + error.code    + '\n' +
          'message: ' + error.message + '\n');
  },

  calculateTimes: function(){
    this.times = SunCalc.getTimes(new Date(),this.position.coords.latitude, this.position.coords.longitude);
    this.times.myTime = this.localTime(new Date());
    console.log("myTime:",this.times.myTime );
    console.log("solarNoon:",this.times.solarNoon);
  },

  localTime: function(today){
    var year = today.getFullYear();
    var month = today.getMonth();
    var day = today.getDate();
    var solarNoon = this.times.solarNoon.valueOf();
    var localNoon = new Date(year,month,day,12).valueOf();
    var offset = solarNoon - localNoon;
    var localZTime = today.valueOf();
    var localTime = localZTime - offset;
    var localDate = new Date(localTime);
    return localDate;
  }

};

document.addEventListener('deviceready', myTimeZone.initialize(), false);

// determine latitude

// Draw circle

// indicate direction in degrees 0 North

// indicate sunrise and sunset point in degrees

// draw noon radius perpendicular to line connecting sunrise and sunset

// indicate noon sun position on radius using altitude