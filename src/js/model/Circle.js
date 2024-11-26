class Circle {
	constructor(center, radius) {
		this.center = center;
		this.radius = radius;
	}

	draw(canvas) {
		canvas.noFill();
		canvas.circle(this.center.x, this.center.y, this.radius);
	}

	perimeter() {
		return 2 * Math.PI * this.radius;
	}

	area() {
		return Math.PI * this.radius * this.radius;
	}

	static fromEnclosingPolygon(polygon) {
		let center = polygon.getCentroid();
		let radius = polygon.getFarthestDistance(center);
		return new Circle(center, radius);
	}

	static fromCenterPerimeter(center, p) {
		return new Circle(center, p / (2 * Math.PI));
	}
}