
 

function circleFrom3Points (pt1,pt2,pt3)
{
  var center = {x:-1, y:-1};
  var radius = -1;

    radius=-1;   // error checking 
    
    if (!isPerpendicular(pt1, pt2, pt3) )       calcCircle(pt1, pt2, pt3);  
    else if (!isPerpendicular(pt1, pt3, pt2) )    calcCircle(pt1, pt3, pt2);  
    else if (!isPerpendicular(pt2, pt1, pt3) )    calcCircle(pt2, pt1, pt3);  
    else if (!isPerpendicular(pt2, pt3, pt1) )    calcCircle(pt2, pt3, pt1);  
    else if (!isPerpendicular(pt3, pt2, pt1) )    calcCircle(pt3, pt2, pt1);  
    else if (!isPerpendicular(pt3, pt1, pt2) )    calcCircle(pt3, pt1, pt2);  
    else { 
      console.log("\nThe three pts are perpendicular to axis\n");
  //    pt1.console.log();     pt2.console.log();     pt3.console.log();
      radius=-1;
      return ;
    }

    return {center: center, radius: radius}


  function isPerpendicular(pt1,pt2,pt3)
  // Check the given point are perpendicular to x or y axis 
  {
    var yDelta_a= pt2.y - pt1.y;
    var xDelta_a= pt2.x - pt1.x;
    var yDelta_b= pt3.y - pt2.y;
    var xDelta_b= pt3.x - pt2.x;
    

  //  console.log(" yDelta_a: %f xDelta_a: %f \n",yDelta_a,xDelta_a);
  //  console.log(" yDelta_b: %f xDelta_b: %f \n",yDelta_b,xDelta_b);

    // checking whether the line of the two pts are vertical
    if (Math.abs(xDelta_a) <= 0.000000001 && Math.abs(yDelta_b) <= 0.000000001){
      console.log("The points are pependicular and parallel to x-y axis\n");
      return false;
    }

    if (Math.abs(yDelta_a) <= 0.0000001){
  //    console.log(" A line of two point are perpendicular to x-axis 1\n");
      return true;
    }
    else if (Math.abs(yDelta_b) <= 0.0000001){
  //    console.log(" A line of two point are perpendicular to x-axis 2\n");
      return true;
    }
    else if (Math.abs(xDelta_a)<= 0.000000001){
  //    console.log(" A line of two point are perpendicular to y-axis 1\n");
      return true;
    }
    else if (Math.abs(xDelta_b)<= 0.000000001){
  //    console.log(" A line of two point are perpendicular to y-axis 2\n");
      return true;
    }
    else return false ;
  }

  function calcCircle(pt1, pt2, pt3){
    var yDelta_a= pt2.y - pt1.y;
    var xDelta_a= pt2.x - pt1.x;
    var yDelta_b= pt3.y - pt2.y;
    var xDelta_b= pt3.x - pt2.x;

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