/* eslint-disable no-undef, no-unused-vars */

function orientation_determinant(a, b, c) {
	// > 0 is RIGHT, < 0 is LEFT, = 0 is colinear
	return (b.x * c.y) - (a.x * c.y) + (a.x * b.y) - (b.y * c.x) + (a.y * c.x) - (a.y * b.x);
}

function sign(a) {
	if (a == 0) {
		return 0;
	}
	return (a > 0) ? 1 : -1;
}

class Shape{
	draw(){}
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
	getSymmetricPoint(sym_line) {
		let v = new Point(sym_line.b.x - sym_line.a.x, sym_line.b.y - sym_line.a.y);
		let v_90 = new Point(-v.y, v.x);
		let m = sym_line.getIntersection(new Line(this, new Point(this.x + v_90.x, this.y + v_90.y)));
		let v_pm = new Point(m.x - this.x, m.y - this.y);
		return new Point(m.x + v_pm.x, m.y + v_pm.y);
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
	intersect(line){
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
		return orientation_determinant(this.a, this.b, p) == 0 && 
                p.x >= Math.min(this.a.x, this.b.x) && 
                p.x <= Math.max(this.a.x, this.b.x) && 
                p.y >= Math.min(this.a.y, this.b.y) && 
                p.y <= Math.max(this.a.y, this.b.y);
	}
	getIntersection(otherLine) {
		let m = (this.b.y - this.a.y) / (this.b.x - this.a.x);
		let c = this.a.y - m * this.a.x;
		let n = (otherLine.b.y - otherLine.a.y) / (otherLine.b.x - otherLine.a.x);
		let d = otherLine.a.y - n * otherLine.a.x;
		let x = (d - c) / (m - n);
		let y = m * x + c;
		return new Point(x, y);
	}
}

class Polygon extends Shape {
	constructor(points_list) {
		super();
		this.points = points_list;
		this.convex_hull = this.getConvexHull();
	}
	draw() {
		for (let i = 0; i < this.points.length; i++) {
			line(this.points[i].x, this.points[i].y, this.points[(i+1)%this.points.length].x, this.points[(i+1)%this.points.length].y);
			this.points[i].draw();
		}
	}
	getPerimeter() {
		let perimeter = 0;
		for (let i = 0; i < this.points.length; i++) {
			perimeter += this.points[i].distance(this.points[(i+1)%this.points.length]);
		}
		return perimeter;
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
	getConvexHull() { //Graham Scan
		if (this.points.length < 3) {
			return this.points;
		}
		let copy = this.points.slice();
		let minx = this.findMinimum();
		copy = copy.filter((x) => x !== minx);
		copy.sort(minx.leftRadialComparator.bind(minx));
		copy.unshift(minx);
		let result = [copy[0], copy[1]];
		for (let i = 2; i < copy.length; i++) {
			while (result.length >= 2 && orientation_determinant(result[result.length-2], result[result.length-1], copy[i]) >= 0) {
				result.pop();
			}
			result.push(copy[i]);
		}
		return result;
	}
	getNeighbourConvexHullPoint(p, left) {
		let index = this.points.indexOf(p);
		let n = this.points.length;;
		for (let i = 1; i < n; i++) {
			let search_index = 0;
			if (left) {
				search_index = index - i;
			} else {
				search_index = index + i;
			}
			search_index = (search_index + n) % n;
			if (this.convex_hull.includes(this.points[search_index])) {
				return this.points[search_index];
			}
		}
	}
	getPreviousConvexHullPoint(p) {
		return this.getNeighbourConvexHullPoint(p, true);
	}
	getNextConvexHullPoint(p) {
		return this.getNeighbourConvexHullPoint(p, false);
	}
	convexify() {
		let new_points = [];
		for (let p of this.points) {
			if (this.convex_hull.includes(p)) {
				new_points.push(p);
				continue;
			}
			let a = this.getPreviousConvexHullPoint(p);
			let b = this.getNextConvexHullPoint(p);
			new_points.push(p.getSymmetricPoint(new Line(a,b)));
		}
		this.points = new_points;
		this.convex_hull = this.getConvexHull();
	}
}

function convexify() {
	if (lastLine == null) {
		isNotAPolygon = true;
		return;
	}
	if (polygon == null) {
		polygon = new Polygon(points);
	}
	polygon.convexify();
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
	lastLine = null;
	polygon = null;
	isNotAPolygon = false;
}

function setup() {
	let c = createCanvas(windowWidth, windowHeight);
	c.mousePressed(onMousePressed);

	fill("black");
	textSize(50);
	textAlign(CENTER);

	button = createButton("Clear");
	button.style('font-size', '30px');
	button.size(2*windowWidth/20, windowHeight/20);
	button.position(windowWidth/2 - button.width/2, 19*windowHeight/20 - button.height/2);
	button.style('cursor', 'pointer');
	button.mousePressed(reset);
	
	button = createButton("Convexify");
	button.style('font-size', '30px');
	button.size(2*windowWidth/20, windowHeight/20);
	button.position(windowWidth/2 - button.width/2, 18*windowHeight/20 - button.height/2);
	button.style('cursor', 'pointer');
	button.mousePressed(convexify);
}

function draw() {
	background(200);
	if (points.length == 0) {
		text("Behold the emptiness of the plane\n0o0", windowWidth/2, windowHeight/2);
		return;
	}
	if (isNotAPolygon) {
		text("This is not a valid polygon", windowWidth/2, windowHeight/2);
	}
	if (polygon != null) {
		polygon.draw();
		text(polygon.getPerimeter(), windowWidth/2, windowHeight/2);
		return;
	}
	for (i of points) {
		i.draw();
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
	let newline = new Line(points[points.length-1], new Point(mouseX, mouseY));
	for (l of lines) {
		if (newline.intersect(l) && l != lines[lines.length-1]) {
			return;
		}
		if (l == lines[lines.length-1]){
			if (l.pointOnLine(new Point(mouseX, mouseY))) {
				return;
			}
			if (orientation_determinant(l.a, l.b, new Point(mouseX, mouseY)) == 0) {
				points.pop();
			}
		}
	}
	lines.push(new Line(points[points.length-1], new Point(mouseX, mouseY)));
	points.push(new Point(mouseX, mouseY));
	lastLine = new Line(points[points.length-1], points[0]);
	if (lines.length == 1) {
		lastLine = null;
		return;
	}
	for (l of lines) {
		if (l.intersect(lastLine) && l != lines[0] && l != lines[lines.length-1]) {
			lastLine = null;
			return;
		}
	}
}

// This Redraws the Canvas when resized
windowResized = function () {
	resizeCanvas(windowWidth, windowHeight);
};

