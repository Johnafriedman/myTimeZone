
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
    var c = this.calcCircle(p0,p2,p1);
    this.paper.circle(c.x, c.y, c.radius)

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

  calcCircle: function(pt1, pt2, pt3){
    var yDelta_a= pt2.y - pt1.y;
    var xDelta_a= pt2.x - pt1.x;
    var yDelta_b= pt3.y - pt2.y;
    var xDelta_b= pt3.x - pt2.x;

    var center = {x:-1, y:-1}, radius = -1;


    function distance( point1, point2 )
    {
      var xs = 0;
      var ys = 0;

      xs = point2.x - point1.x;
      xs = xs * xs;

      ys = point2.y - point1.y;
      ys = ys * ys;

      return Math.sqrt( xs + ys );
    }
    
    if (Math.abs(xDelta_a) <= 0.000000001 && Math.abs(yDelta_b) <= 0.000000001){
      console.log("Calc cirlce \n");
      center.x= 0.5*(pt2.x + pt3.x);
      center.y= 0.5*(pt1.y + pt2.y);
      radius= distance(center,pt1);   // calc. radius
     console.log(" Center: %f %f %f\n", center.x, center.y);
     console.log(" radius: %f %f %f\n", distance(center,pt1), distance(center,pt2),distance(center,pt3));

      return {x: center.x, y: center.y, radius: radius};
    }
    
    // IsPerpendicular() assure that.xDelta(s) are not zero
    var aSlope=yDelta_a/xDelta_a; // 
    var bSlope=yDelta_b/xDelta_b;
    if (Math.abs(aSlope-bSlope) <= 0.000000001){  // checking whether the given points are colinear.  
      console.log("The three pts are colinear\n");
      return {x: center.x, y: center.y, radius: radius};;
    }

    // calc center
    center.x= (aSlope*bSlope*(pt1.y - pt3.y) + bSlope*(pt1.x + pt2.x)
      - aSlope*(pt2.x+pt3.x) )/(2* (bSlope-aSlope) );
    center.y = -1*(center.x - (pt1.x+pt2.x)/2)/aSlope +  (pt1.y+pt2.y)/2;

    radius= distance(center,pt1);   // calc. radius
   console.log(" Center: \n", center.x, center.y);
   console.log(" Radius: \n", radius);
   console.log(" radius: \n", distance(center,pt1), distance(center,pt2),distance(center,pt3));
    return {x: center.x, y: center.y, radius: radius};
  }
};

document.addEventListener('deviceready', myTimeZone.initialize(), false);

// determine latitude

// Draw circle

// indicate direction in degrees 0 North

// indicate sunrise and sunset point in degrees

// draw noon radius perpendicular to line connecting sunrise and sunset

// indicate noon sun position on radius using altitude