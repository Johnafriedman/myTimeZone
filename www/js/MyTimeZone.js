
(function () { 'use strict';

  var
    position= {},
    times= {},
    offset= 0,
    draw= null,
    displayWidth= document.documentElement.clientWidth,
    displayHeight= document.documentElement.clientHeight,
    drawSize= Math.min(displayWidth, displayHeight),
    dial = {center: {x: drawSize/2, y: drawSize/2}, radius: drawSize/2};


  function renderBackground (){
    var inc = Math.PI/32,
      r0={}, r1={}, r2={};


      for(var angle = 0; angle < Math.PI*2; angle += inc){
        r0.x = Math.cos(angle) * dial.radius + dial.center.x;
        r0.y = Math.sin(angle) * dial.radius + dial.center.y;
        r1.x = Math.cos(angle+inc) * dial.radius + dial.center.x;
        r1.y = Math.sin(angle+inc) * dial.radius + dial.center.y;
        r2.x = Math.cos(angle+inc/2) * dial.radius + dial.center.x;
        r2.y = Math.sin(angle+inc/2) * dial.radius + dial.center.y;



        var gradient = draw.gradient('linear', function(stop) {
          stop.at(0, '#000')
          stop.at(1, '#fff')
        })
        var s = ""+dial.center.x+","+dial.center.y+" "+r0.x+","+r0.y +" "+r1.x+","+r1.y ;

        var x0=r2.x, x1=dial.center.x, y0=r2.y, y1=dial.center.y;


        gradient.attr("gradientUnits","userSpaceOnUse");
        gradient.from(x0,y0).to(x1,y1);

        var polygon = draw.polygon(s).fill(gradient);


      }
    }

  // function renderBackground (){
  //   var daylight = times.sunset.valueOf() - times.sunrise.valueOf();
  //   var timeInc = daylight/;
  //   var sunpos0 = {center: {}};
  //   var sunpos1 = {center: {}};
  //   var radius0 = {center: {}};
  //   var radius1 = {center: {}};
  //   for(var time = times.sunrise.valueOf(); time <= times.sunset.valueOf(); time+= timeInc){

  //     sunpos0.angle = SunCalc.getPosition(new Date(time), position.coords.latitude, position.coords.longitude);
  //     sunpos1.angle = SunCalc.getPosition(new Date(time+timeInc), position.coords.latitude, position.coords.longitude);
  //     // sunpos1.angle.azimuth+=(.2* (sunpos1.angle.azimuth>=0?-1:1));

  //     sunpos0.center.x = Math.cos(sunpos0.angle.azimuth) * dial.radius * Math.cos(sunpos0.angle.altitude) + dial.center.x;
  //     sunpos0.center.y = Math.sin(sunpos0.angle.azimuth) * dial.radius * Math.cos(sunpos0.angle.altitude) + dial.center.y;

  //     radius0.center.x = Math.cos(sunpos0.angle.azimuth) * dial.radius  + dial.center.x;
  //     radius0.center.y = Math.sin(sunpos0.angle.azimuth) * dial.radius  + dial.center.y;

  //     radius1.center.x = Math.cos(sunpos1.angle.azimuth) * dial.radius  + dial.center.x;
  //     radius1.center.y = Math.sin(sunpos1.angle.azimuth) * dial.radius  + dial.center.y;

  //     var path =
  //     [
  //       ["M",dial.center.x,dial.center.y],
  //       ["L", radius0.center.x,radius0.center.y],
  //       ["L", radius1.center.x,radius1.center.y],
  //       ["Z"]
  //     ];
  //     var
  //       // color = "hsb(.6, .65, "+(1.25-Math.cos(sunpos0.angle.altitude))+")",
  //       angle = Raphael.deg(sunpos0.angle.azimuth + (sunpos1.angle.azimuth-sunpos0.angle.azimuth)/2);
  //       angle = (angle<0?angle+360:angle);

  //       var grad = angle+"-#000-hsb(.6, .65, 1):"+(1-Math.cos(sunpos0.angle.altitude))*100+"-#000";

  //       grad = angle+"-#000-hsb(.6, .65, 1):50-#000";
  //       console.log("angle", angle, "sunangle", Raphael.deg(sunpos0.angle.azimuth));

  //     draw.path(path).attr({fill:  grad, "stroke": grad, "stroke-width":10});
  //   }
  // }

  function render (){

    draw = SVG('myTimeZone').fixSubPixelOffset().size(drawSize, drawSize);

    renderBackground();


    var sunrise = {center: {}};
    var sunset = {center: {}};
    var solarNoon = {center: {}};
    sunrise.angle = SunCalc.getPosition(times.sunrise, position.coords.latitude, position.coords.longitude);
    sunset.angle = SunCalc.getPosition(times.sunset, position.coords.latitude, position.coords.longitude);
    solarNoon.angle = SunCalc.getPosition(times.solarNoon, position.coords.latitude, position.coords.longitude);

    // draw.circle(dial.center.x, dial.center.y, dial.radius);

    var daylight = times.sunset.valueOf() - times.sunrise.valueOf();
    var moonpos = {center: {}, radius: 40};
    var sunpos = {center: {}, radius: 40};
    var sunpos1 = {center: {}, radius: 40};
    var sunpath = [];
    var action = "M";
    for(var time = times.sunrise.valueOf(); time <= times.sunset.valueOf(); time+= daylight/12){

      sunpos.angle = SunCalc.getPosition(new Date(time), position.coords.latitude, position.coords.longitude);
      moonpos.angle = SunCalc.getMoonPosition(new Date(time), position.coords.latitude, position.coords.longitude);

      sunpos.center.x = Math.cos(sunpos.angle.azimuth) * dial.radius * Math.cos(sunpos.angle.altitude) + dial.center.x;
      sunpos.center.y = Math.sin(sunpos.angle.azimuth) * dial.radius * Math.cos(sunpos.angle.altitude) + dial.center.y;
      draw.circle(sunpos.radius).cx(sunpos.center.x).cy(sunpos.center.y);

      // moonpos.center.x = Math.cos(moonpos.angle.azimuth) * dial.radius * Math.cos(moonpos.angle.altitude) + dial.center.x;
      // moonpos.center.y = Math.sin(moonpos.angle.azimuth) * dial.radius * Math.cos(moonpos.angle.altitude) + dial.center.y;
      // draw.circle(moonpos.center.x, moonpos.center.y, moonpos.radius).attr({fill: "rgb(255, 255, 255)"});


      sunpath.push([action, sunpos.center.x, sunpos.center.y]);
      action = "L";

      sunpos1.center.x = Math.cos(sunpos.angle.azimuth) * dial.radius  + dial.center.x;
      sunpos1.center.y = Math.sin(sunpos.angle.azimuth) * dial.radius  + dial.center.y;
      draw.circle(sunpos.radius).cx(sunpos.center.x).cy(sunpos.center.y).attr({fill: "rgb(255, 255, 0)"});

      var path = [["M",dial.center.x,dial.center.y],["L", sunpos.center.x,sunpos.center.y]];
      // draw.path(path);
      path = [["M", sunpos.center.x,sunpos.center.y],["L", sunpos1.center.x,sunpos1.center.y]];
      // draw.path(path).attr({stroke: "hsb(0, .75, .75)" , "stroke-width": 4, "stroke-linecap": "round"});
      // draw.path("M"+dial.center.x+" "+dial.center.y+"L"+sunpos.center.x+" "+sunpos.center.y+"L"+sunpos1.center.x+" "+sunpos1.center.y);


    }
    // draw.path(sunpath);



    // var c = circleFrom3Points(p0,p1,p2);
    // draw.circle(c.center.x, c.center.y, c.radius)

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
