
(function () { 'use strict';

  var
    targetDate = new Date(2015,11,21),

    position= {},
    times= {},
    offset= 0,
    draw= null,
    displayWidth= document.documentElement.clientWidth,
    displayHeight= document.documentElement.clientHeight,
    drawSize= Math.min(displayWidth, displayHeight),
    dial = {center: {x: drawSize/2, y: drawSize/2}, radius: drawSize/2},
    sunrise = {center: {}},
    sunset = {center: {}},
    solarNoon = {center: {}},
    skyBlue = tinycolor("#87CEFA");



  function renderBackground (){
    var
      sun = {pos: {}},
      steps = 96,
      angleInc = 2*Math.PI/steps,
      timeInc = (1000 * 60 * 60 * 24)/steps,
      r0={}, r1={}, r2={};


    var sunrise = SunCalc.getPosition(new Date(times.sunrise), position.coords.latitude, position.coords.longitude);
    var sunTime = new Date(times.sunrise).valueOf();
    for(var angle = sunrise.azimuth; angle < sunrise.azimuth+Math.PI*2; angle += angleInc){
      r0.x = Math.cos(angle) * dial.radius + dial.center.x;
      r0.y = Math.sin(angle) * dial.radius + dial.center.y;
      r1.x = Math.cos(angle+angleInc+.02) * dial.radius + dial.center.x;
      r1.y = Math.sin(angle+angleInc+.02) * dial.radius + dial.center.y;
      var gangle = angle+angleInc/2;
      r2.x = Math.cos(gangle) * dial.radius + dial.center.x ;
      r2.y = Math.sin(gangle) * dial.radius + dial.center.y ;

      var sunDate = new Date(sunTime);
      sun.pos = SunCalc.getPosition(sunDate, position.coords.latitude, position.coords.longitude);
      sunTime+= timeInc;

      var r = Math.cos(sun.pos.altitude);

      var v,
        color = [];

      for(var i=0;i<3;i++){
        color[i] = tinycolor(skyBlue).toHsv();
      }

      if(sun.pos.altitude>0){
        v = .3+((1-r)*1.8);
      }else{
        v = .3-((1-r)*1.8);

      }
      v = Math.min(Math.max(v,0),1);
      color[0].v = v;
      color[0].s = .0;
      color[1].v = v;
      color[1].s = .5;
      color[2].v = v;
      color[2].s = 1;

      for(var i=0;i<3;i++){
        color[i] = tinycolor(color[i]).toHexString();
      }

      var gradient = draw.gradient('linear', function(stop) {
        stop.at(0, color[0]);
        stop.at(.25, color[1]);
        stop.at(1, color[2]);
      })

      var x0=r2.x, x1=dial.center.x, y0=r2.y, y1=dial.center.y;


      gradient.attr("gradientUnits","userSpaceOnUse");

      // translate line along slope

      gradient.from(x0,y0).to(x1,y1);

      var s = ""+dial.center.x+","+dial.center.y+" "+r0.x+","+r0.y +" "+r1.x+","+r1.y ;
      var polygon = draw.polygon(s).fill(gradient);

    }
  }

  function renderRing(circle, width, steps){
    var
      angleInc = Math.PI*2/steps,
      p0={},
      p1={};

      draw.circle(circle.radius*2).cx(circle.center.x).cy(circle.center.y).stroke({width: 1}).fill("none");
      draw.circle(((circle.radius-width)*2)).cx(circle.center.x).cy(circle.center.y).stroke({width: 1}).fill("none");

    for(var angle = 0; angle < Math.PI*2; angle += angleInc){
      p0.x = Math.cos(angle) * circle.radius + circle.center.x;
      p0.y = Math.sin(angle) * circle.radius + circle.center.y;

      p1.x = Math.cos(angle) * (circle.radius-width) + circle.center.x ;
      p1.y = Math.sin(angle) * (circle.radius-width) + circle.center.y ;
      draw.line(p0.x, p0.y, p1.x, p1.y).stroke({width: 1});
    }
  }

  function render (){

    draw = SVG('myTimeZone').fixSubPixelOffset().size(drawSize, drawSize);
    sunrise.angle = SunCalc.getPosition(times.sunrise, position.coords.latitude, position.coords.longitude);
    sunset.angle = SunCalc.getPosition(times.sunset, position.coords.latitude, position.coords.longitude);
    solarNoon.angle = SunCalc.getPosition(times.solarNoon, position.coords.latitude, position.coords.longitude);

    renderBackground();
    renderRing(dial, 20,360);
    renderRing(dial, dial.radius-40,24);
    renderDay();

  }

  function renderDay(){

    var
      sun = {
        radius: 40,
        center: {x: 0, y:0},
        pos : {}
      },

      moon = {
        illumination: {},
        radius: 40,
        center: {x:0, y:0},
        pos : {}
      };

    moon.illumination = SunCalc.getMoonIllumination(targetDate);

    for(var hour=0, time = times.sunrise.valueOf(); hour < 24; time+= (60*60*1000), hour++){

      sun.pos = SunCalc.getPosition(new Date(time), position.coords.latitude, position.coords.longitude);
      moon.pos = SunCalc.getMoonPosition(new Date(time), position.coords.latitude, position.coords.longitude);

      sun.center.x = Math.cos(sun.pos.azimuth) * dial.radius * Math.cos(sun.pos.altitude) + dial.center.x;
      sun.center.y = Math.sin(sun.pos.azimuth) * dial.radius * Math.cos(sun.pos.altitude) + dial.center.y;

      moon.center.x = Math.cos(moon.pos.azimuth) * dial.radius * Math.cos(moon.pos.altitude) + dial.center.x;
      moon.center.y = Math.sin(moon.pos.azimuth) * dial.radius * Math.cos(moon.pos.altitude) + dial.center.y;

      renderMoon(moon);
      renderSun(sun);

    }

  };

  function renderMoon(moon){
    var moonAttr={},
      foreColor,
      backColor,
      opacity;

    if(moon.illumination.fraction<.5){
      foreColor = "#ffffff";
      backColor = "#000000";
    }else{
      foreColor = "#000000";
      backColor = "#ffffff";
    }

    if(moon.pos.altitude>0){
      opacity= 1;
    }else{
      opacity= .25;
    }

    var group = draw.group();
    var circle = draw.circle(moon.radius).cx(moon.center.x).cy(moon.center.y).attr({fill: backColor, 'fill-opacity':.25});
    group.add(circle);
    //draw.ellipse(moon.radius*(1-moon.illumination.fraction*2), moon.radius).cx(moon.center.x).cy(moon.center.y).attr({fill: foreColor, 'fill-opacity':opacity});
    var mr2 = moon.radius/2,
      arc = new SVG.PathArray([
      ['M',moon.center.x,moon.center.y-mr2],
      ['A',mr2,mr2,0,1,0,moon.center.x,moon.center.y+mr2],
      ['A',mr2-mr2*(moon.illumination.fraction),mr2,0,0,1,moon.center.x,moon.center.y-mr2],
      ['Z']
    ]);
    var arc = draw.path(arc).attr({fill:foreColor});
    group.add(arc);
    group.rotate(moon.illumination.angle *180/Math.PI);
  };

  function renderSun(sun){
    var sunAttr={};
    if(sun.pos.altitude>0){
      sunAttr={
        'fill-opacity': 1,
        fill: "#ffff00"
      }
    }else{
      sunAttr={
        'fill-opacity': .25,
        fill: "#000040"
      }
    }

    draw.circle(sun.radius).cx(sun.center.x).cy(sun.center.y).attr(sunAttr);

  };

  function getLocation(){
    console.log("identifying location");
    // navigator.geolocation.getCurrentPosition(onGPSSuccess, onGPSError);
    onGPSSuccess({coords: {latitude: 26, longitude: 90}});
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
    times = SunCalc.getTimes(targetDate,position.coords.latitude, position.coords.longitude);
    times.myTime = localTime(targetDate);
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
