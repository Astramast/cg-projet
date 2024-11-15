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

function convexify() {
  /**
   * polygon : list of Points
   * */

  // let reversedVertices, concaveVertices = reflectReflexVertices(polygon);
  // updatePolygon(polygon, reversedVertices, concaveVertices);

  let {reversedVertices, concaveVertices} = reflectReflexVertices(polygon.points.map(p => [p.x, p.y]));
  updatePolygon(polygon, reversedVertices, concaveVertices);

  /* refresh the displayed polygon here */
  // polygon.draw();  // dont work
  // draw();  // dont work
  // polygon.draw();  // dont work
  // for (let t = 0; t < triangles.length; t++) {
  //   triangles[t].draw();
  // }

}

function updatePolygon(polygon, reversedVertices, concaveVertices) {
  // Remove concave vertices from the polygon
  polygon.points = polygon.points.filter(p => !concaveVertices.some(cv => cv[0] === p.x && cv[1] === p.y));

  // Add the reflected vertices to the polygon
  for (let rv of reversedVertices) {
    polygon.points.push(new Point(rv[0], rv[1]));
  }
}

function convexHull(points) {
  // Helper function to calculate the convex hull using Andrew's monotone chain algorithm
  points.sort((a, b) => a[0] === b[0] ? a[1] - b[1] : a[0] - b[0]);
  let lower = [];
  for (let p of points) {
    while (lower.length >= 2 && orientation_determinant(lower[lower.length - 2], lower[lower.length - 1], p) <= 0) {
      lower.pop();
    }
    lower.push(p);
  }
  let upper = [];
  for (let i = points.length - 1; i >= 0; i--) {
    let p = points[i];
    while (upper.length >= 2 && orientation_determinant(upper[upper.length - 2], upper[upper.length - 1], p) <= 0) {
      upper.pop();
    }
    upper.push(p);
  }
  upper.pop();
  lower.pop();
  return lower.concat(upper);
}

function reflectPoint(p, a, b) {
  // Helper function to reflect a point across a line segment
  let dx = b[0] - a[0];
  let dy = b[1] - a[1];
  let t = ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / (dx * dx + dy * dy);
  let x = a[0] + t * dx;
  let y = a[1] + t * dy;
  return [2 * x - p[0], 2 * y - p[1]];
}

function reflectReflexVertices(polygon) {
  // Main function to find and reflect reflex vertices
  let concaveVertices = [];
  for (let i = 0; i < polygon.length; i++) {
    let prev = polygon[(i - 1 + polygon.length) % polygon.length];
    let curr = polygon[i];
    let next = polygon[(i + 1) % polygon.length];
    if (orientation_determinant(prev, curr, next) < 0) {
      concaveVertices.push(curr);
    }
  }

  let hull = convexHull(polygon);
  let reflectedVertices = concaveVertices.map(vertex => {
    let minDist = Infinity;
    let nearestEdge = null;
    for (let i = 0; i < hull.length; i++) {
      let a = hull[i];
      let b = hull[(i + 1) % hull.length];
      let dist = Math.abs((b[1] - a[1]) * vertex[0] - (b[0] - a[0]) * vertex[1] + b[0] * a[1] - b[1] * a[0]) / Math.sqrt((b[1] - a[1]) ** 2 + (b[0] - a[0]) ** 2);
      if (dist < minDist) {
        minDist = dist;
        nearestEdge = [a, b];
      }
    }
    return reflectPoint(vertex, nearestEdge[0], nearestEdge[1]);
  });

  return { reflectedVertices, concaveVertices };
}
