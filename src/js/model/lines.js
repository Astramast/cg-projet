class Line {
	constructor(a,b){
		this.a = a;
		this.b = b;
	}
	draw () {
		let p = new Point(windowWidth, this.getYFromX(windowWidth));
		let q = new Point(0, this.getYFromX(0));
		line(p.x, p.y, q.x, q.y);
	}
	isEqual(otherline){
		return (this.a.orientationDeterminant(this.b, otherline.a) == 0 && this.a.orientationDeterminant(this.b, otherline.b) == 0)
	}
	getYFromX(x) {
		let m = (this.b.y - this.a.y) / (this.b.x - this.a.x);
		let c = this.a.y - m * this.a.x;
		return m * x + c;
	}
	getIntersection(otherLine) {
		if (!intersectLineLine(this, otherLine)) return null;
		let m = (this.b.y - this.a.y) / (this.b.x - this.a.x);
		let om = (otherLine.b.y - otherLine.a.y) / (otherLine.b.x - otherLine.a.x);
		let c = this.a.y - m * this.a.x;
		let oc = otherLine.a.y - om * otherLine.a.x;
		let x = (oc - c) / (m - om);
		let y = m * x + c;
		return new Point(x, y);
	}
	isPointOnLine(p){
		return this.getYFromX(p.x) == p.y;
	}
}

class SemiLine {
	constructor(a,b){
		this.a = a;
		this.b = b;
	}
	isEqual(semiline){
		return (this.a.x == semiline.a.x && this.a.y == semiline.a.y && this.b.orientationDeterminant(this.a, semiline.b) == 0);
	}
	draw () {
		let p = null;
		if (this.a.x < this.b.x) {
			p = new Point(windowWidth, new Line(this.a, this.b).getYFromX(windowWidth));
		} else {
			p = new Point(0, new Line(this.a, this.b).getYFromX(0));
		}
		line(this.a.x, this.a.y, p.x, p.y);
	}
	getLineIntersection(otherLine) {
		if (!intersectLineSemiLine(otherLine, this)) return null;
		return new Line(this.a, this.b).getIntersection(otherLine);
	}
}

class Segment {
	constructor(a,b){
		this.a = a;
		this.b = b;
	}
	draw () {
		line(this.a.x, this.a.y, this.b.x, this.b.y);
	}
	getLineIntersection(otherLine) {
		if (!intersectLineSegment(otherLine, this)) return null;
		return new Line(this.a, this.b).getIntersection(otherLine);
	}
}

function intersectLineLine(line1, line2) {
	let v1 = new Point(line1.b.x - line1.a.x, line1.b.y - line1.a.y);
	let v2 = new Point(line2.b.x - line2.a.x, line2.b.y - line2.a.y);
	return v1.x * v2.y - v1.y * v2.x;
}

function intersectLineSemiline(line, semiline) {
	if (!intersectLineLine(line, semiline)) return false;
	let o1 = line.a.orientationDeterminant(line.b, semiline.b);
	let v = new Point(line.b.x - line.a.x, line.b.y - line.a.y);
	let c = new Point(semiline.a.x + v.x, semiline.a.y + v.y);
	let o2 = semiline.a.orientationDeterminant(c, line.b);
	return o1 * o2 < 0;
}

function intersectLineSegment(line, segment) {
	let o1 = line.a.orientationDeterminant(line.b, segment.a);
	let o2 = line.a.orientationDeterminant(line.b, segment.b);
	return o1 * o2 < 0;
}

function intersectSemilineSemiline(semiline1, semiline2) {
	if (!intersectLineLine(semiline1, semiline2)) return false;
	let one = intersectLineSemiline(semiline1, semiline2);
	let two = intersectLineSemiline(semiline2, semiline1);
	return one && two;
}

function intersectSemilineSegment(semiline, segment) {
	let one = intersectLineSemiline(semiline, segment);
	let two = intersectLineSegment(semiline, segment);
	return one && two;
}

function intersectSegmentSegment(segment1, segment2) {
	let one = intersectLineSegment(segment1, segment2);
	let two = intersectLineSegment(segment2, segment1);
	return one && two;
}

window.Line = Line;
window.SemiLine = SemiLine;
window.Segment = Segment;
window.intersectLineLine = intersectLineLine;
window.intersectLineSemiline = intersectLineSemiline;
window.intersectLineSegment = intersectLineSegment;
window.intersectSemilineSemiline = intersectSemilineSemiline;
window.intersectSemilineSegment = intersectSemilineSegment;
window.intersectSegmentSegment = intersectSegmentSegment;
