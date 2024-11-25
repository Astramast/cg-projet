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

	isEqual(line) {
		return (this.a.orientationDeterminant(this.b, line.a) === 0 && this.a.orientationDeterminant(this.b, line.b) === 0);
	}

	getYFromX(x) {
		let m = (this.b.y - this.a.y) / (this.b.x - this.a.x);
		let c = this.a.y - m * this.a.x;
		return m * x + c;
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

	isAbove(point) {
		return point.y > this.getYFromX(point.x);
	}

	getDirection() {
		if (this.slope === Infinity) {
			return {x: 0, y: 1}; // Vertical line
		} else if (this.slope === 0) {
			return {x: 1, y: 0}; // Horizontal line
		} else {
			// For other lines, normalize the direction vector
			let dx = 1;
			let dy = this.slope;
			let magnitude = Math.sqrt(dx * dx + dy * dy);
			return {x: dx / magnitude, y: dy / magnitude};
		}
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

class SemiLine extends Line {
	constructor(a, b) {
		super(a, b);
	}

	isEqual(semiline) {
		return this.a.x === semiline.a.x && this.a.y === semiline.a.y && this.b.orientationDeterminant(this.a, semiline.b) === 0;
	}

	draw(canvas) {
		canvas.line(this.a.x, this.a.y, this.b.x, this.b.y);
	}

	getYFromX(x) {
		let m = (this.b.y - this.a.y) / (this.b.x - this.a.x);
		let c = this.a.y - m * this.a.x;
		return m * x + c;
	}
}

class Segment {
	constructor(a, b) {
		this.a = a;
		this.b = b;
	}

	draw() {
		line(this.a.x, this.a.y, this.b.x, this.b.y);
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