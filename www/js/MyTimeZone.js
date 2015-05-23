
(function () { 'use strict';

  var position= {},
  times= {},
  offset= 0,
  paper= null,
  
  function render (){
    displayWidth= document.documentElement.clientWidth,
    displayHeight= document.documentElement.clientHeight,
    paperSize= Math.min(displayWidth, displayHeight);
    paper = Raphael(0, 0, paperSize, paperSize);

    paper.clear();
    var p0 = {x:50,y:50}, p1 = {x:150, y:50}, p2= {x:100, y:100};
    paper.circle(p0.x, p0.y, 10);
    paper.circle(p1.x, p1.y, 10);
    paper.circle(p2.x, p2.y, 10);
    var c = circleFrom3Points(p0,p1,p2);
    paper.circle(c.center.x, c.center.y, c.radius)

    var s="";
    _.forEach(times, function(d,k){
        s=s+k+":"+d+"\n";

    });
    paper.text(200, 100, s);

    var sunrise = SunCalc.getPosition(times.sunrise, position.coords.latitude, position.coords.longitude);
    var solarNoon = SunCalc.getPosition(times.solarNoon, position.coords.latitude, position.coords.longitude);
    var sunset = SunCalc.getPosition(times.sunset, position.coords.latitude, position.coords.longitude);
    console.log(sunrise, solarNoon, sunset);

  };

  function getLocation(){
    paper.text(200, 100, "identifying location");
    navigator.geolocation.getCurrentPosition(onGPSSuccess, onGPSError);
  };

  function onGPSSuccess(GeoPosition){
    position = GeoPosition;
    calculateTimes();
    render();
  };

  function onGPSError (error){
    alert('code: '    + error.code    + '\n' +
          'message: ' + error.message + '\n');
  };

  function calculateTimes(){
    times = SunCalc.getTimes(new Date(),position.coords.latitude, position.coords.longitude);
    times.myTime = localTime(new Date());
    console.log("myTime:",times.myTime );
    console.log("solarNoon:",times.solarNoon);
  };

  function localTime (today){
    var year = today.getFullYear();
    var month = today.getMonth();
    var day = today.getDate();
    var solarNoon = times.solarNoon.valueOf();
    var localNoon = new Date(year,month,day,12).valueOf();
    var offset = solarNoon - localNoon;
    var localZTime = today.valueOf();
    var localTime = new Date(localZTime - offset);
    return localTime;
  };

  var MyTimeZone = {};

  MyTimeZone.initialize = function() {
    _.bindAll(this);
    getLocation();
  };

// export as AMD module / Node module / browser variable
if (typeof define === 'function' && define.amd) define(MyTimeZone);
else if (typeof module !== 'undefined') module.exports = MyTimeZone;
else window.MyTimeZone = MyTimeZone;
  
}());
