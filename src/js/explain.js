/* eslint-disable no-undef, no-unused-vars */

function orientation_determinant(a, b, c) {
  // > 0 is RIGHT, < 0 is LEFT, = 0 is colinear
  return b.x * c.y - a.x * c.y + a.x * b.y - b.y * c.x + a.y * c.x - a.y * b.x;
}

function sign(a) {
  if (a == 0) {
    return 0;
  }
  return a > 0 ? 1 : -1;
}

class Shape {
  draw() {}
}

class Point extends Shape {
  constructor(x, y) {
    super();
    this.x = x;
    this.y = y;
  }
  draw() {
    ellipse(this.x, this.y, 4, 4);
  }
  distance(p) {
    return Math.sqrt(Math.pow(this.x - p.x, 2) + Math.pow(this.y - p.y, 2));
  }
  leftRadialComparator(a, b) {
    //Answers to : Is a more at left than b ?
    let od = orientation_determinant(this, a, b);
    if (od > 0) {
      return true;
    }
    if (od == 0) {
      return this.distance(a) > this.distance(b);
    }
    return false;
  }
  isEqual(p) {
    return this.x == p.x && this.y == p.y;
  }
}

class Line extends Shape {
  constructor(a, b) {
    super();
    this.a = a;
    this.b = b;
  }
  draw() {
    line(this.a.x, this.a.y, this.b.x, this.b.y);
  }
  intersect(line) {
    let o1 = orientation_determinant(this.a, this.b, line.a);
    let o2 = orientation_determinant(this.a, this.b, line.b);
    let o3 = orientation_determinant(line.a, line.b, this.a);
    let o4 = orientation_determinant(line.a, line.b, this.b);
    if (sign(o1) != sign(o2) && sign(o3) != sign(o4)) {
      return true;
    }
    return false;
  }
  pointOnLine(p) {
    return (
      orientation_determinant(this.a, this.b, p) == 0 &&
      p.x >= Math.min(this.a.x, this.b.x) &&
      p.x <= Math.max(this.a.x, this.b.x) &&
      p.y >= Math.min(this.a.y, this.b.y) &&
      p.y <= Math.max(this.a.y, this.b.y)
    );
  }
}

class Triangle extends Shape {
  constructor(a, b, c) {
    super();
    this.a = a;
    this.b = b;
    this.c = c;
  }
  draw() {
    line(this.a.x, this.a.y, this.b.x, this.b.y);
    line(this.b.x, this.b.y, this.c.x, this.c.y);
    line(this.c.x, this.c.y, this.a.x, this.a.y);
  }
  pointInTriangle(p) {
    const ab = orientation_determinant(this.a, this.b, p);
    const bc = orientation_determinant(this.b, this.c, p);
    const ca = orientation_determinant(this.c, this.a, p);
    return (ab >= 0 && bc >= 0 && ca >= 0) || (ab <= 0 && bc <= 0 && ca <= 0);
  }
}

class Polygon extends Shape {
  constructor(points) {
    super();
    this.points = points;
  }
  draw() {
    for (let i = 0; i < this.points.length; i++) {
      line(
        this.points[i].x,
        this.points[i].y,
        this.points[(i + 1) % this.points.length].x,
        this.points[(i + 1) % this.points.length].y
      );
    }
  }
  findMinimum() {
    let minX = this.points[0];
    for (i of this.points) {
      if (i.x < minX.x) {
        minX = i;
      }
    }
    return minX;
  }
  sortPoints() {
    let minP = this.findMinimum();
    let beforePoints = [];
    let afterPoints = [];
    let i = 0;
    while (points[i] != minP) {
      beforePoints.push(points[i]);
      i++;
    }
    while (i < points.length) {
      afterPoints.push(points[i]);
      i++;
    }
    this.points = afterPoints.concat(beforePoints);
    if (
      orientation_determinant(
        this.points[1],
        this.points[0],
        this.points[this.points.length - 1]
      ) <= 0
    ) {
      this.points.reverse();
    }
  }
  findEars() {
    if (this.points.length == 3) {
      return this;
    }
    let ears = [];
    for (let i = 0; i < this.points.length; i++) {
      var a = this.points[(i - 1 + this.points.length) % this.points.length];
      var b = this.points[i];
      var c = this.points[(i + 1) % this.points.length];
      if (orientation_determinant(a, b, c) < 0) {
        var triangle = new Triangle(a, b, c);
        let flag = true;
        for (let j = 0; j < this.points.length; j++) {
          if (j == i || j == i - 1 || j == i + 1) {
            continue;
          }
          if (triangle.pointInTriangle(this.points[j])) {
            flag = false;
            break;
          }
        }
        if (flag) {
          ears.push(triangle);
          let newPoints = this.points.filter((item) => item != this.points[i]);
          return ears.concat(new Polygon(newPoints).findEars());
        }
      }
    }
  }
  triangulate() {
    this.sortPoints();
    return this.findEars();
  }
}

var points = [];
var lines = [];
var triangles = [];
var lastLine = null;
var polygon = null;
var isNotAPolygon = false;

function reset() {
  points = [];
  lines = [];
  triangles = [];
  lastLine = null;
  polygon = null;
  isNotAPolygon = false;
}

function triangulate() {
  if (lastLine == null) {
    isNotAPolygon = true;
    return;
  }
  lines = [];
  polygon = new Polygon(points);
  triangles = polygon.triangulate();
}

function setup() {
  let c = createCanvas(windowWidth, windowHeight);
  c.mousePressed(onMousePressed);

  fill("black");
  textSize(50);
  textAlign(CENTER);

  button = createButton("Clear");
  button.style("font-size", "30px");
  button.size((6 * windowWidth) / 20, windowHeight / 20);
  button.position(
    windowWidth / 2 - button.width / 2,
    (19 * windowHeight) / 20 - button.height / 2
  );
  button.style("cursor", "pointer");
  button.mousePressed(reset);

  button2 = createButton("Convexify");
  button2.style("font-size", "30px");
  button2.size((6 * windowWidth) / 20, windowHeight / 20);
  button2.position(
    windowWidth / 2 - button2.width / 2,
    (18 * windowHeight) / 20 - button2.height / 2
  );
  button2.style("cursor", "pointer");
  button2.mousePressed(convexify);

}

function draw() {
  background(200);
  if (points.length == 0) {
    text(
      "Behold the emptiness of the plane\n0o0",
      windowWidth / 2,
      windowHeight / 2
    );
    return;
  }

  for (i of points) {
    i.draw();
  }
  if (isNotAPolygon) {
    text("This is not a valid polygon", windowWidth / 2, windowHeight / 2);
  }
  if (polygon != null) {
    polygon.draw();
    for (let t = 0; t < triangles.length; t++) {
      triangles[t].draw();
    }
    return;
  }
  for (l of lines) {
    l.draw();
  }
  if (lastLine != null) {
    lastLine.draw();
  }
}

function onMousePressed() {
  isNotAPolygon = false;
  for (let i = 0; i < points.length; i++) {
    if (points[i].x == mouseX && points[i].y == mouseY) {
      return;
    }
  }
  if (points.length == 0) {
    points.push(new Point(mouseX, mouseY));
    return;
  }
  if (polygon != null) {
    reset();
    points.push(new Point(mouseX, mouseY));
    return;
  }
  let newline = new Line(points[points.length - 1], new Point(mouseX, mouseY));
  for (l of lines) {
    if (newline.intersect(l) && l != lines[lines.length - 1]) {
      return;
    }
    if (l == lines[lines.length - 1]) {
      if (l.pointOnLine(new Point(mouseX, mouseY))) {
        return;
      }
      if (orientation_determinant(l.a, l.b, new Point(mouseX, mouseY)) == 0) {
        points.pop();
      }
    }
  }
  lines.push(new Line(points[points.length - 1], new Point(mouseX, mouseY)));
  points.push(new Point(mouseX, mouseY));
  lastLine = new Line(points[points.length - 1], points[0]);
  if (lines.length == 1) {
    lastLine = null;
    return;
  }
  for (l of lines) {
    if (
      l.intersect(lastLine) &&
      l != lines[0] &&
      l != lines[lines.length - 1]
    ) {
      lastLine = null;
      return;
    }
  }
}

// This Redraws the Canvas when resized
windowResized = function () {
  resizeCanvas(windowWidth, windowHeight);
};

function convexify() {  // drawing not working  
  let old_points = [...points];  // static copy  
  // let old_points = points.slice();
  if (alreadyConvex(old_points)) {
    console.log("already convex");
    return;
  } else {
    console.log("not convex");
    console.log("convexifying...");
  }

  let new_polygon = newAlgo(points);
  console.log("new polygon :", new_polygon);
  console.log("old polygon :", old_points);
  points = new_polygon;

  // let {reversed_vertices, concave_vertices} = findReflexVertices(points);
  // updatePolygon(points, reversed_vertices, concave_vertices);
  // test_update_polygon(old_points, points, concave_vertices, reversed_vertices);
  // one big pb is that it doesnt choose the right hull edge

  /* refresh the displayed polygon here */  // stil not functionnal bcs of old code
  // let _polygon_ = new Polygon(points)
  // console.log("list of points :", polygon_points);
  // console.log("object polygon :", _polygon_);
  // _polygon_.draw();  // dont work
  // draw();  // dont work
  // for (let t = 0; t < triangles.length; t++) {
  //   triangles[t].draw();
  // }

}

function alreadyConvex(polygon) {
  let alreadyConvex = false;
  let hull = computeConvexHull(polygon)
  if (polygon.length == hull.length) {
    alreadyConvex = true;
  }
  console.log("hull", hull);
  console.log("polygon", polygon);
  return alreadyConvex
}

function reflectPoint(c, a, b) {
  // voir feuille arthur, jongler avec les vecteurs
  
  let v = new Point(b.x - a.x, b.y - a.y);
  let v_ = new Point(-v.y, v.x);

  let M = ((b.y - a.y) / (b.x - a.x))
  let C = (a.y - ((b.y - a.y) / (b.x - a.x)) * a.x)
  let M_ = ((v_.y - c.y) / (v_.x - c.x))
  let C_ = (c.y - ((v_.y - c.y) / (v_.x - c.x)) * c.x)

  let y_mX_c = (X) => M * X + C;
  // let y_mX_c_prime = (X) => ((v_.y - c.y) / (v_.x - c.x)) * X + (c.y - ((v_.y - c.y) / (v_.x - c.x)) * c.x);

  let X = (C_ - C) / (M - M_)
  let Y = y_mX_c(X)
  let mid = new Point(X, Y)
  let c_sym = new Point(2*mid.x - c.x, 2*mid.y - c.y) 

  return c_sym;
}

function findInHull(hull, polygon, pt) {
  let null_point = new Point(0, 0);
  let a = new Point(0, 0);
  let b = new Point(0, 0);
  let pt_i = polygon.indexOf(pt);
  let ln = polygon.length;

  for (let i=1; i<ln; i++) {  // itere vers la gch
    let j = (pt_i - i + ln) % ln;
    if (hull.includes(polygon[j])) {
      a = polygon[j];
      break;
    }
  }

  for (let i=1; i<ln; i++) {  // itere vers la dr
    let j = (pt_i + i) % ln;
    if (hull.includes(polygon[j])) {
      b = polygon[j];
      break;
    }
  }
    if (a.isEqual(null_point) || b.isEqual(null_point)){
      console.log("ERROR : a, b not found in hull");
    }
  return {a, b};
}

function findConcaveVertices(polygon) {  // NOT functionnal
  // here we find the reflex vertices
  let concave_vertices = [];
  for (let i = 0; i < polygon.length; i++) {
    let prev = polygon[(i - 1 + polygon.length) % polygon.length];
    let curr = polygon[i];
    let next = polygon[(i + 1) % polygon.length];
    if (orientation_determinant(prev, curr, next) > 0) {
      concave_vertices.push(curr);
    }
  }
  console.log(concave_vertices)
  return concave_vertices;
}

function newAlgo(polygon) {
  let hull = computeConvexHull(polygon);
  let concaves = findConcaveVertices(polygon);
  let vide = [];

  for (let pt of polygon) {
    if (!concaves.includes(pt)) {
      vide.push(pt);
      continue;
    } else {
      let {a, b} = findInHull(hull, polygon, pt);  // done
      let reversed_point = reflectPoint(pt, a, b);  // to be done
      vide.push(reversed_point);
    }
  }

  return vide;
}


//////////////TEST///////////////////

function test_reflect_point() {  // functionnal
  let p = new Point(1, 0);
  let a = new Point(0, 0);
  let b = new Point(0, 1);
  let reflected = reflectPoint(p, a, b);
  let expected_point = new Point(1, 1)
  console.log("Reflected Point:", reflected);
  console.log("Expected Point:", expected_point);
  if (reflected.x == expected_point.x && reflected.y == expected_point.y) {
    console.log("GOOD : reflectPoint worked")
  } else {
    console.log("ERROR : reflectPoint doesnt work")
  }
}

function test_update_polygon(old_polygon, new_polygon, toDelete, toAdd) {  // functionnal
  // first simple check, not enough to prove the polygon updated correctly
  if (JSON.stringify(old_polygon) === JSON.stringify(new_polygon)) {
    console.log("ERROR : The polygon has not changed");
    return;
  }

    console.log("Old Polygon:", old_polygon);
    console.log("New Polygon:", new_polygon);
    console.log("Vertices to Delete:", toDelete);
    console.log("Vertices to Add:", toAdd);

  // mode advanced check
  for (let pt of new_polygon) {
    for (let del of toDelete) {
      if (pt.x == del.x && pt.y == del.y) {
        console.log("ERROR : concave vertex not deleted")
        return;
      }
    }
  }

  for (let add of toAdd) {
    let added = false;
    for (let pt of new_polygon) {
      if (pt.x == add.x && pt.y == add.y) {
        added = true;
      }
    }
    if (!added) {
      console.log("ERROR : reflected vertex not added")
      return;
    }
  }
  console.log("GOOD : the polygon has been updated correctly")
}


///////////////////////// DEPRECATED /////////////////////////////////

function updatePolygon(polygon, reversed_vertices, concave_vertices) {  // functionnal
  // Parameters polygon, reversed_vertices, concave_vertices : list of Point
  
  // Remove concave vertices from the polygon
  for (let del of concave_vertices) {
    for (let pt of polygon) {
      if (pt.x == del.x && pt.y == del.y) {
        polygon.splice(polygon.indexOf(pt), 1);
      }
    }
  }

  // Add the reflected vertices to the polygon
  for (let rv of reversed_vertices) {
    polygon.push(new Point(rv.x, rv.y));
  }
}

function prevNextAlgo(polygon, concave_vertices) {  // deprecated
  // Parameter polygon, concave_vertices : list of Point
  let reversed_vertices = [];
  
  let first = polygon.indexOf(concave_vertices[0]);
  let last = polygon.indexOf(concave_vertices[concave_vertices.length -1]);
  
  let prev = polygon[(first -1 + polygon.length) % polygon.length]
  let next = polygon[(last +1) % polygon.length]

  for (let current of concave_vertices) {
    let reversed_point = reflectPoint(current, prev, next)
    reversed_vertices.push(reversed_point);
  }
  return reversed_vertices;
}

function nearestEdgeAlgo(polygon, concave_vertices) {  // deprecated
  // we reflect the point by symmetry with the nearest edge of the convex hull
  // Parameter polygon, concave_vertices : list of Point
  let hull = computeConvexHull(polygon);
  let reversed_vertices = [];
  for (let vertex of concave_vertices) {
    let nearest_edge = findNearestEdge(vertex, hull);
    let reversed_point = reflectPoint(vertex, nearest_edge[0], nearest_edge[1]);
    reversed_vertices.push(reversed_point);
  }
  return reversed_vertices;
}

function findNearestEdge(vertex, hull) {
  // using square root is forbidden
  let minDist = Infinity;
    let nearestEdge = null;
    for (let i = 0; i < hull.length; i++) {
      let a = hull[i];
      let b = hull[(i + 1) % hull.length];
      let dist = Math.abs((b.y - a.y) * vertex.x - (b.x - a.x) * vertex.y + b.x * a.y - b.y * a.x) / Math.sqrt((b.y - a.y) ** 2 + (b.x - a.x) ** 2);
      if (dist < minDist) {
        minDist = dist;
        nearestEdge = [a, b];
      }
    }
    if (nearestEdge) {
      return nearestEdge;
    }
    else {  // not a pb anymore
      console.log("nearestEdge is null, \
        either there is no concave ear or the algo wrong")
    }
}

// function findReflexVertices(polygon) {
//   // Parameter polygon : list of Point
  
//   // here we find the reflex vertices
//   let concave_vertices = [];
//   let reversed_vertices = []
//   for (let i = 0; i < polygon.length; i++) {
//     let prev = polygon[(i - 1 + polygon.length) % polygon.length];
//     let curr = polygon[i];
//     let next = polygon[(i + 1) % polygon.length];
//     if (orientation_determinant(prev, curr, next) > 0) {
//       let reversed_point = reflectPoint(curr, prev, next);
//       reversed_vertices.push(reversed_point);
//       concave_vertices.push(curr);
//     }
//   }
//   return { reversed_vertices, concave_vertices };
// }

// function findReflexVertices(polygon) {
//   // Parameter polygon : list of Point
  
//   // here we find the reflex vertices
//   let concave_vertices = [];
//   for (let i = 0; i < polygon.length; i++) {
//     let prev = polygon[(i - 1 + polygon.length) % polygon.length];
//     let curr = polygon[i];
//     let next = polygon[(i + 1) % polygon.length];
//     if (orientation_determinant(prev, curr, next) > 0) {
//       concave_vertices.push(curr);
//     }
//   }

//   // let reversed_vertices = prevNextAlgo(polygon, concave_vertices);
//   // let reversed_vertices = nearestEdgeAlgo(polygon, concave_vertices);
//   let reversed_vertices = newAlgo(polygon, concave_vertices);

//   return { reversed_vertices, concave_vertices };
// }


// function reflectPoint(p, a, b) {  // tested and functionnal
//   // Helper function to reflect a point across a line segment
//   // parametes p, a, b : Point
//   let dx = Math.abs(b.x - a.x);
//   let dy = Math.abs(b.y - a.y);
//   let new_p = new Point(p.x + dx, p.y + dy)
//   return new_p
// }


// function isEqual(polygon, hull) {
//   let compare = polygon.map(() => false);
//   for (let pt of polygon) {
//     for (let pt2 of hull) {
//       if (pt == pt2) {
//         compare[polygon.indexOf(pt)] = true;
//       }
//     }
//   }
//   for (cp of compare) {
//     if (cp == false) {
//       return false;
//     }
//   }
//   return true;
// }