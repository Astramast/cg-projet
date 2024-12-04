class Circle {
	constructor(center, radius) {
		this.center = center;
		this.radius = radius;
	}
	draw(canvas) {
		canvas.stroke("#FFF9BF");
		canvas.fill("#ba76f1");
		canvas.circle(this.center.x, this.center.y, this.radius * 2);
	}
	static fromTwoPoints(p, q){
		const center = new Point((p.x + q.x) / 2, (p.y + q.y) / 2);
		const radius = center.euclidianDistance(p);
		return new Circle(center, radius);
	}
	static fromThreePoints(p, q, r){
		const pqBissector = p.getPerpendicularBisector(q);
		const prBissector = p.getPerpendicularBisector(r);
		const center = prBissector.getIntersection(pqBissector);
		const radius = center.euclidianDistance(p);
		return new Circle(center, radius);
	}
	getPerimeter() {
		return 2 * Math.PI * this.radius;
	}

	containsPoint(point) {
		return this.center.euclidianDistance(point) <= this.radius;
	}

}
