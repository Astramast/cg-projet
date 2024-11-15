class Point {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
	orientationDeterminant(b,c) {
        // > 0 is RIGHT, < 0 is LEFT, = 0 is colinear
        return (b.x * c.y) - (this.x * c.y) + (this.x * b.y) - (b.y * c.x) + (this.y * c.x) - (this.y * b.x);
	}
}

window.Point = Point;
