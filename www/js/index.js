
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
    this.times = SunCalc.getTimes(new Date(),position.coords.latitude, position.coords.longitude);
    var t = new Date().getTime() + (new Date().getTimezoneOffset()*60*1000); // UTC time
    this.offset = position.coords.longitude*(24*60*60*1000/360); // mt = lat* ms per degree
    this.times.myTime = new Date(t+this.offset);

    this.render();
  },

  onGPSError: function(error){
    alert('code: '    + error.code    + '\n' +
          'message: ' + error.message + '\n');
  }

};

document.addEventListener('deviceready', myTimeZone.initialize(), false);

mt = (360/24)*mlat

// determine latitude

// Draw circle

// indicate direction in degrees 0 North

// indicate sunrise and sunset point in degrees

// draw noon radius perpendicular to line connecting sunrise and sunset

// indicate noon sun position on radius using altitude