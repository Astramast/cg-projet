class Point {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	draw(canvas) {
		canvas.ellipse(this.x, this.y, 6, 6);
	}

	orientationDeterminant(b, c) {
		// > 0 is RIGHT, < 0 is LEFT, = 0 is colinear
		return (b.x * c.y) - (this.x * c.y) + (this.x * b.y) - (b.y * c.x) + (this.y * c.x) - (this.y * b.x);
	}

	// Returns the distance between two points
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

}
