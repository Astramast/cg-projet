class CircleIntersection {
	constructor(circles) {
		this.circles = circles;
		this.radius = circles[0].radius;
		this.curves = [];
		this.computeIntersection();
	}

	draw(canvas){
		for (let curve of this.curves){
			curve.draw(canvas);
		}
	}

	findCircleIntersections(circle1, circle2) {
		const x1 = circle1.center.x;
		const y1 = circle1.center.y;
		const r1 = circle1.radius;

		const x2 = circle2.center.x;
		const y2 = circle2.center.y;
		const r2 = circle2.radius;

		// Distance between the centers
		const dx = x2 - x1;
		const dy = y2 - y1;
		const d = Math.sqrt(dx * dx + dy * dy);

		// Check if circles are separate, one contains the other, or coincident
		if (d > r1 + r2 || d < Math.abs(r1 - r2) || d === 0) {
			return []; // No intersection points or infinite points
		}

		// Find the point `P` where the line through the circle intersection points crosses the line between the circle centers
		const a = (r1 * r1 - r2 * r2 + d * d) / (2 * d);
		const h = Math.sqrt(r1 * r1 - a * a);

		// Coordinates of point P
		const px = x1 + (a * dx) / d;
		const py = y1 + (a * dy) / d;

		// Offset of the intersection points from P
		const offsetX = (h * dy) / d;
		const offsetY = (h * dx) / d;

		// Intersection points
		return [new Point(px + offsetX, py - offsetY), new Point(px - offsetX, py + offsetY)];
	}

	computeIntersection() {
		// First for each pair of circles, calculate the intersection points
		// If the point is inside all the other circles, add it to the intersection points
		let intersectionPoints = [];
		for (let i = 0; i < this.circles.length; i++) {
			for (let j = i + 1; j < this.circles.length; j++) {
				const points = this.findCircleIntersections(this.circles[i], this.circles[j]);
				for (let point of points) {
					let isPointInAllCircles = true;
					for (let k = 0; k < this.circles.length; k++) {
						if (k === i || k === j) {
							continue;
						}
						if (!this.circles[k].containsPoint(point)) {
							isPointInAllCircles = false;
							break;
						}
					}
					if (isPointInAllCircles) {
						intersectionPoints.push(point);
					}
				}
			}
		}

		// Make the convex hull of the intersection points, so that it is radially sorted
		intersectionPoints = new ConvexHull(intersectionPoints).points;

		// Then, for each point and the one next to him, calculate the curve between them
		for (let i = 0; i < intersectionPoints.length; i++) {
			const p = intersectionPoints[i];
			const q = intersectionPoints[(i + 1) % intersectionPoints.length];
			this.curves.push(new Curve(p, q, this.radius));
		}
	}

	perimeter(){
		return this.curves.reduce((acc, curve) => acc + curve.perimeter(), 0);
	}
}