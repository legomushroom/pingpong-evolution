
// const slope = (x1, y1, x2, y2) => {
//   if (x1 == x2) return false;
//   return (y1 - y2) / (x1 - x2);
// };

// const yInt = (x1, y1, x2, y2) => {
//   if (x1 === x2) return y1 === 0 ? 0 : false;
//   if (y1 === y2) return y1;

//   const sl = slope(x1, y1, x2, y2);
//   return (sl === false) ? sl : y1 - (sl * x1);
// };

// const getXInt = (x1, y1, x2, y2) => {
//   var slope;
//   if (y1 === y2) return x1 == 0 ? 0 : false;
//   if (x1 === x2) return x1;
//   return (-1 * ((slope = slope(x1, y1, x2, y2)) * x1 - y1)) / slope;
// };

// export const getIntersection = (x11, y11, x12, y12, x21, y21, x22, y22) => {
//   var slope1, slope2, yint1, yint2, intx, inty;
//   if (x11 == x21 && y11 == y21) return { x: x11, y: y11};
//   if (x12 == x22 && y12 == y22) return { x: x12, y: y22};

//   slope1 = slope(x11, y11, x12, y12);
//   slope2 = slope(x21, y21, x22, y22);
//   if (slope1 === slope2) return false;

//   yint1 = yInt(x11, y11, x12, y12);
//   yint2 = yInt(x21, y21, x22, y22);
//   if (yint1 === yint2) return yint1 === false ? false : { x: 0, y: yint1};

//   if (slope1 === false) return { x: y21, y: slope2 * y21 + yint2};
//   if (slope2 === false) return { x: y11, y: slope1 * y11 + yint1};
//   intx = (slope1 * x11 + yint1 - yint2) / slope2;

//   return {
//     x: intx,
//     y: slope1 * intx + yint1
//   };
// }

export const getIntersection = (x1, y1, x2, y2, x3, y3, x4, y4) => {
    var ua, ub, denom = (y4 - y3)*(x2 - x1) - (x4 - x3)*(y2 - y1);
    if (denom == 0) {
        return false;
    }
    ua = ((x4 - x3)*(y1 - y3) - (y4 - y3)*(x1 - x3))/denom;
    ub = ((x2 - x1)*(y1 - y3) - (y2 - y1)*(x1 - x3))/denom;
    return {
        x: x1 + ua*(x2 - x1),
        y: y1 + ua*(y2 - y1),
        seg1: ua >= 0 && ua <= 1,
        seg2: ub >= 0 && ub <= 1
    };
}