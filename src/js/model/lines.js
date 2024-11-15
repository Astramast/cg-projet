class Line {
	constructor(a,b){
		this.a = a
		this.b = b
	}
	draw () {
		v = createVector(this.b.x - this.a.x, this.b.y - this.a.y);
		v.normalize();
		v.mult(Math.max(windowWidth, windowHeight));
		line(this.a.x - v.x, this.a.y - v.y, this.a.x + v.x, this.a.y + v.y);
	}
}

class SemiLine {
	constructor(a,b){
		this.a = a
		this.b = b
	}
	isEqual(semiline){
		return this.a.x == semiline.a.x && this.a.y == semiline.a.y && this.b.orientationDeterminant(this.a, semiline.b) == 0;
	}
	draw () {
		v = createVector(this.b.x - this.a.x, this.b.y - this.a.y);
		v.normalize();
		v.mult(Math.max(windowWidth, windowHeight));
		line(this.a.x, this.a.y, this.a.x + v.x, this.a.y + v.y);
	}
}

class Segment {
	constructor(a,b){
		this.a = a
		this.b = b
	}
	draw () {
		line(this.a.x, this.a.y, this.b.x, this.b.y);
	}
}

function intersectLineLine(line1, line2) {
	v1 = Point(line1.b.x - line1.a.x, line1.b.y - line1.a.y);
	v2 = Point(line2.b.x - line2.a.x, line2.b.y - line2.a.y);
	return v1.x * v2.y - v1.y * v2.x;
}

function intersectLineSemiline(line, semiline) {
	if (!intersectLineLine(line, semiline)) return false;
	o1 = line.a.orientationDeterminant(line.b, semiline.b);
	v = Point(line.b.x - line.a.x, line.b.y - line.a.y);
	c = Point(semiline.a.x + v.x, semiline.a.y + v.y);
	o2 = semiline.a.orientationDeterminant(c, line.b);
	return o1 * o2 < 0;
}

function intersectLineSegment(line, segment) {
	o1 = line.a.orientationDeterminant(line.b, segment.a);
	o2 = line.a.orientationDeterminant(line.b, segment.b);
	return o1 * o2 < 0;
}

function intersectSemilineSemiline(semiline1, semiline2) {
	if (!intersectLineLine(semiline1, semiline2)) return false;
	one = intersectLineSemiline(semiline1, semiline2);
	two = intersectLineSemiline(semiline2, semiline1);
	return one && two;
}

function intersectSemilineSegment(semiline, segment) {
	one = intersectLineSemiline(semiline, segment);
	two = intersectLineSegment(semiline, segment);
	return one && two;
}

function intersectSegmentSegment(segment1, segment2) {
	one = intersectLineSegment(segment1, segment2);
	two = intersectLineSegment(segment2, segment1);
	return one && two;
}

