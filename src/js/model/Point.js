class Point {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	isEqual(otherPoint) {
		return (Math.abs(this.x - otherPoint.x) < 1e-6 && Math.abs(this.y - otherPoint.y) < 1e-6);
	}

	draw(canvas) {
		canvas.ellipse(this.x, this.y, 6, 6);
	}

	copy() {
		return new Point(this.x, this.y);
	}
	orientationDeterminant(b,c) {
		// > 0 is RIGHT, < 0 is LEFT, = 0 is colinear
		// We added 1e-6 to avoid floating point errors,
		// this implies that there is an error on close to 0 computations
		let ood = (b.x * c.y) - (this.x * c.y) + (this.x * b.y) - (b.y * c.x) + (this.y * c.x) - (this.y * b.x);
		if (Math.abs(ood) < 1e-6) {
			return 0;
		}
		return ood;
	}

	getOrientationDeterminantSign(b,c) {
		return Math.sign(this.orientationDeterminant(b,c));
	}

	getPerpendicularBisector(otherPoint) {
		// TODO: Assumed general position, complete code for extreme cases
		return perpendicularBisector(this, otherPoint);
	}

	dist(p) {
		return Math.sqrt(Math.pow(this.x - p.x, 2) + Math.pow(this.y - p.y, 2));
	}

	getSymmetricPoint(sym_line) {
		let v = new Point(sym_line.b.x - sym_line.a.x, sym_line.b.y - sym_line.a.y);
		let v_90 = new Point(-v.y, v.x);
		let m = sym_line.getIntersection(new Line(this, new Point(this.x + v_90.x, this.y + v_90.y)));
		let v_pm = new Point(m.x - this.x, m.y - this.y);
		return new Point(m.x + v_pm.x, m.y + v_pm.y);
	}

	getSymmetrical(otherPoint) {
		return new Point(2*otherPoint.x - this.x, 2*otherPoint.y - this.y);
	}

	leftRadialComparator(a, b) {
		//Answers to : Is a more at left than b ?
		let od = this.getOrientationDeterminantSign(a, b);
		if (od > 0) {
			return true;
		}
		if (od == 0) {
			return this.manhattanDistance(a) > this.manhattanDistance(b);
		}
		return false;
	}
	manhattanDistance(otherPoint) {
		return Math.abs(this.x - otherPoint.x) + Math.abs(this.y - otherPoint.y);
	}
	euclidianDistance(otherPoint) {
		return Math.sqrt(Math.pow(this.x - otherPoint.x, 2) + Math.pow(this.y - otherPoint.y, 2));
	}
	inCircle(circle){
		return this.euclidianDistance(circle.center) - circle.radius < 1e-6;
	}
	getEquidistantPoints(otherPoint, r){
		let d = this.euclidianDistance(otherPoint);
		let h = Math.sqrt(r*r - d*d/4);
		let v = new Point(otherPoint.x - this.x, otherPoint.y - this.y);
		let v_90 = new Point(-v.y, v.x);
		let m = new Point((this.x + otherPoint.x)/2, (this.y + otherPoint.y)/2);
		let x1 = new Point(m.x + h*v_90.x, m.y + h*v_90.y);
		let x2 = new Point(m.x - h*v_90.x, m.y - h*v_90.y);
		return [x1, x2];
	}
}

function perpendicularBisector(p, q) {
	// TODO: Assumed general position, complete code for extreme cases
	const y = (x) => ((2 * q.x - 2 * p.x) * x + (p.x ** 2 + p.y ** 2 - q.x ** 2 - q.y ** 2)) / (2 * p.y - 2 * q.y);
	return new Line(new Point(0, y(0)), new Point(10000, y(10000)));
}
