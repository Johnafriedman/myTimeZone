
CalcCircle(pt1, pt2, pt3)
{
  var yDelta_a= pt2.y - pt1.y;
  var xDelta_a= pt2.x - pt1.x;
  var yDelta_b= pt3.y - pt2.y;
  var xDelta_b= pt3.x - pt2.x;
  
  if (Math.abs(xDelta_a) <= 0.000000001 && Math.abs(yDelta_b) <= 0.000000001){
    console.log("Calc cirlce \n");
    this.m_Center.m_x= 0.5*(pt2.x() + pt3.x());
    this.m_Center.m_y= 0.5*(pt1.y() + pt2.y());
    this.m_Center.m_z= pt1.z();
    this.m_dRadius= length(&m_Center,pt1);   // calc. radius
   console.log(" Center: %f %f %f\n", m_Center.x(), m_Center.y(), m_Center.z());
   console.log(" radius: %f %f %f\n", length(&m_Center,pt1), length(&m_Center,pt2),length(&m_Center,pt3));

    return this.m_dRadius;
  }
  
  // IsPerpendicular() assure that xDelta(s) are not zero
  var aSlope=yDelta_a/xDelta_a; // 
  var bSlope=yDelta_b/xDelta_b;
  if (fabs(aSlope-bSlope) <= 0.000000001){  // checking whether the given points are colinear.  
    console.log("The three pts are colinear\n");
    return -1;
  }

  // calc center
  this.m_Center.m_x= (aSlope*bSlope*(pt1.m_y - pt3.m_y) + bSlope*(pt1.m_x + pt2 .m_x)
    - aSlope*(pt2.m_x+pt3.m_x) )/(2* (bSlope-aSlope) );
  this.m_Center.m_y = -1*(m_Center.x() - (pt1.x()+pt2.x())/2)/aSlope +  (pt1.y()+pt2.y())/2;
  this.m_Center.m_z= pt1.m_z;

  this.m_dRadius= length(&m_Center,pt1);   // calc. radius
 console.log(" Center: %f %f %f\n", m_Center.x(), m_Center.y(), m_Center.z());
 console.log(" radius: %f %f %f\n", length(&m_Center,pt1), length(&m_Center,pt2),length(&m_Center,pt3));
  return this.m_dRadius;
}
