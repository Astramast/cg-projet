class Line {
	constructor(a, b) {
		this.a = a;
		this.b = b;
	}

	draw(canvas) {
		// Compute value of y when x = 0
		let y0 = this.getYFromX(0);
		// Compute value of y when x = windowWidth
		let y1 = this.getYFromX(canvas.windowWidth);
		canvas.line(0, y0, canvas.windowWidth, y1);
	}

	isEqual(otherline){
		return (this.a.orientationDeterminant(this.b, otherline.a) === 0 && this.a.orientationDeterminant(this.b, otherline.b) === 0)
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
		return this.getYFromX(p.x) === p.y;
	}

	computeDualPoint() {
		if (this.a.x === this.b.x) {
			return new Point(1 / this.a.x, 0);
		}
		let m = (this.b.y - this.a.y) / (this.b.x - this.a.x);
		let p = this.a.y - m * this.a.x;
		if (p === 0) {
			return null;
		}
		const a = (-1 * m) / p;
		const b = 1 / p;
		return new Point(a, b);
	}
}

class SemiLine {
	constructor(a, b) {
		this.a = a;
		this.b = b;
	}

	isEqual(semiline) {
		return this.a.x === semiline.a.x && this.a.y === semiline.a.y && this.b.orientationDeterminant(this.a, semiline.b) === 0;
	}

	draw(canvas) {
		canvas.line(this.a.x, this.a.y, this.b.x, this.b.y);
	}

	getIntersection(otherLine) {
		if (!intersectLineSemiline(otherLine, this)) return null;
		return new Line(this.a, this.b).getIntersection(otherLine);
	}
}

class Segment {
	constructor(a, b) {
		this.a = a;
		this.b = b;
	}

	draw(canvas) {
		canvas.line(this.a.x, this.a.y, this.b.x, this.b.y);
	}

	getIntersection(otherLine) {
		if (!intersectLineSegment(otherLine, this)) return null;
		return new Line(this.a, this.b).getIntersection(otherLine);
	}
}

function intersectLineLine(line1, line2) {
	let v1 = new Point(line1.b.x - line1.a.x, line1.b.y - line1.a.y);
	let v2 = new Point(line2.b.x - line2.a.x, line2.b.y - line2.a.y);
	return Math.abs(v1.x * v2.y - v1.y * v2.x) > 1e-6;
}

function intersectLineSemiline(line, semiline) {
	if (!intersectLineLine(line, semiline)) return false;
	let o1 = line.a.getOrientationDeterminantSign(line.b, semiline.b);
	if (o1 == 0) return true;
	let v = new Point(line.b.x - line.a.x, line.b.y - line.a.y);
	let c = new Point(semiline.a.x + v.x, semiline.a.y + v.y);
	let o2 = semiline.a.getOrientationDeterminantSign(c, line.b);
	return o1 * o2 >= 0;
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