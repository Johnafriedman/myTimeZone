
var myTimeZone = {

  position: {},
  times: {},
  offset: 0,
  paper: null,

  initialize: function() {
    _.bindAll(this);
    this.paper = Raphael(10, 50, 1024, 768);
    //myTimeZone.getLocation();
    this.render();
  },

  render: function(){
    this.paper.clear();
    var p0 = {x:50,y:50}, p1 = {x:150, y:50}, p2= {x:100, y:100};
    this.paper.circle(p0.x, p0.y, 10);
    this.paper.circle(p1.x, p1.y, 10);
    this.paper.circle(p2.x, p2.y, 10);
    var c = circleFrom3Points(p0,p1,p2);
    this.paper.circle(c.center.x, c.center.y, c.radius)

    // var s="";
    // _.forEach(this.times, function(d,k){
    //     s=s+k+":"+d+"\n";

    // });
    // this.paper.t.xt(200, 100, s);

  },

  getLocation: function(){
    this.paper.t.xt(200, 100, "identifying location");
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
    var localTime = new Date(localZTime - offset);
    return localTime;
  },

  
};

document.addEventListener('deviceready', myTimeZone.initialize(), false);

// determine latitude

// Draw circle

// indicate direction in degrees 0 North

// indicate sunrise and sunset point in degrees

// draw noon radius perpendicular to line connecting sunrise and sunset

// indicate noon sun position on radius using altitude