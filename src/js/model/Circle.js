class Circle {
	constructor(center, radius) {
		this.center = center;
		this.radius = radius;
	}

	static fromEnclosingPolygon(polygon) {
		let center = polygon.getCentroid();
		let radius = polygon.getFarthestDistance(center);
		return new Circle(center, radius);
	}

	static fromCenterPerimeter(center, p) {
		return new Circle(center, p / (2 * Math.PI));
	}

	draw(canvas) {
		canvas.stroke("#FFF9BF");
		canvas.fill("#ba76f1");
		canvas.circle(this.center.x, this.center.y, this.radius * 2);
	}

	perimeter() {
		return 2 * Math.PI * this.radius;
	}

	area() {
		return Math.PI * this.radius * this.radius;
	}
}