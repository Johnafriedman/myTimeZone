
(function () { 'use strict';

  var 
    position= {},
    times= {},
    offset= 0,
    paper= null,
    dial={};
    
  function render (){
    var
      displayWidth= document.documentElement.clientWidth,
      displayHeight= document.documentElement.clientHeight,
      paperSize= Math.min(displayWidth, displayHeight),
      paper = Raphael(0, 0, paperSize, paperSize),
      dial = {center: {x: paperSize/2, y: paperSize/2}, radius: paperSize/2};


    paper.clear();

    

    var sunrise = {center: {}};
    var sunset = {center: {}};
    var solarNoon = {center: {}};
    sunrise.angle = SunCalc.getPosition(times.sunrise, position.coords.latitude, position.coords.longitude);
    sunset.angle = SunCalc.getPosition(times.sunset, position.coords.latitude, position.coords.longitude);
    solarNoon.angle = SunCalc.getPosition(times.solarNoon, position.coords.latitude, position.coords.longitude);

    // sunrise.center.x = Math.cos(sunrise.angle.azimuth)*dial.radius+dial.center.x;
    // sunrise.center.y = Math.sin(sunrise.angle.azimuth)*dial.radius+dial.center.y;
    // sunrise.radius = 40;

    // sunset.center.x = Math.cos(sunset.angle.azimuth)*dial.radius+dial.center.x;
    // sunset.center.y = Math.sin(sunset.angle.azimuth)*dial.radius+dial.center.y;
    // sunset.radius = 40;

    // solarNoon.center.x = Math.cos(solarNoon.angle.azimuth)*dial.radius * Math.cos(solarNoon.angle.altitude) +dial.center.x;
    // solarNoon.center.y = Math.sin(solarNoon.angle.azimuth)*dial.radius+dial.center.y;
    // solarNoon.radius = 40;

    paper.circle(dial.center.x, dial.center.y, dial.radius);
    paper.circle(sunrise.center.x, sunrise.center.y, sunrise.radius)
    paper.circle(sunset.center.x, sunset.center.y, sunset.radius)
    paper.circle(solarNoon.center.x, solarNoon.center.y, solarNoon.radius)

    var daylight = times.sunset.valueOf() - times.sunrise.valueOf();
    var sunpos = {center: {}, radius: 40};
    var sunpos1 = {center: {}, radius: 40};
    for(var time = times.sunrise.valueOf(); time <= times.sunset.valueOf(); time+= daylight/12){

      sunpos.angle = SunCalc.getPosition(new Date(time), position.coords.latitude, position.coords.longitude);

      sunpos.center.x = Math.cos(sunpos.angle.azimuth) * dial.radius * Math.cos(sunpos.angle.altitude) + dial.center.x;
      sunpos.center.y = Math.sin(sunpos.angle.azimuth) * dial.radius * Math.cos(sunpos.angle.altitude) + dial.center.y;
      paper.circle(sunpos.center.x, sunpos.center.y, sunpos.radius)

      sunpos1.center.x = Math.cos(sunpos.angle.azimuth) * dial.radius  + dial.center.x;
      sunpos1.center.y = Math.sin(sunpos.angle.azimuth) * dial.radius  + dial.center.y;
      paper.circle(sunpos.center.x, sunpos.center.y, sunpos.radius)

      paper.path("M"+sunpos.center.x+" "+sunpos.center.y+"L"+sunpos1.center.x+" "+sunpos1.center.y);



      console.log("cos,sin", Math.cos(sunpos.angle.altitude), Math.sin(sunpos.angle.altitude));

    }



    // var c = circleFrom3Points(p0,p1,p2);
    // paper.circle(c.center.x, c.center.y, c.radius)

    console.log(sunrise, solarNoon, sunset);

  };

  function getLocation(){
    console.log("identifying location");
    // navigator.geolocation.getCurrentPosition(onGPSSuccess, onGPSError);
    onGPSSuccess({coords: {latitude: 45.0, longitude: 90.0}});
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
