class Point {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
	orientationDeterminant(b,c) {
        // > 0 is RIGHT, < 0 is LEFT, = 0 is colinear
        return (b.x * c.y) - (this.x * c.y) + (this.x * b.y) - (b.y * c.x) + (this.y * c.x) - (this.y * b.x);
	}
	getOrientationDeterminantSign(b,c) {
		return Math.sign(this.orientationDeterminant(b,c));
	}
	getPerpendicularBisector(otherPoint) {
		// TODO: Assumed general position, complete code for extreme cases
		const y = (x) => ((2*otherPoint.x - 2*this.x) * x + (this.x**2 + this.y**2 - otherPoint.x**2 - otherPoint.y**2)) / (2*this.y - 2*otherPoint.y);
		return new Line(new Point(0, y(0)), new Point(1, y(1)));
	}
	getSymmetrical(otherPoint) {
		return new Point(2*otherPoint.x - this.x, 2*otherPoint.y - this.y);
	}
}

window.Point = Point;
