class Polygon {
	constructor(points = []) {
		this.points = points;
	}

	// Add a point to the polygon
	addPoint(point) {
		this.points.push(point);
	}

	// Check if the polygon is convex
	isConvex() {
		let sign = 0;
		for (let i = 0; i < this.points.length; i++) {
			const p0 = this.points[i];
			const p1 = this.points[(i + 1) % this.points.length];
			const p2 = this.points[(i + 2) % this.points.length];

			const crossProduct = (p1.x - p0.x) * (p2.y - p1.y) - (p1.y - p0.y) * (p2.x - p1.x);
			const currentSign = Math.sign(crossProduct);

			if (sign === 0) {
				sign = currentSign;
			} else if (currentSign !== 0 && currentSign !== sign) {
				return false; // Non-convex
			}
		}
		return true; // Convex
	}
}

window.Polygon = Polygon;