class Curve {
	constructor(points = [], segments = 100) {
		this.points = points;  // Array of p5.Vector points
		this.segments = segments;  // Number of segments to sample the curve
	}

	addPoint(x, y) {
		this.points.push(createVector(x, y));
	}

	draw() {
		if (this.points.length < 2) return;

		noFill();
		beginShape();
		// Use curveVertex for smooth curves (open path)
		for (let i = 0; i < this.points.length; i++) {
			curveVertex(this.points[i].x, this.points[i].y);
		}
		endShape();
	}

	// Calculate the perimeter by approximating the curve using sampled points
	perimeter() {
		let totalPerimeter = 0;
		let prevPoint = this.points[0];
		for (let i = 1; i <= this.segments; i++) {
			let t = i / this.segments;
			let sampledPoint = this.samplePoint(t);
			totalPerimeter += prevPoint.dist(sampledPoint);
			prevPoint = sampledPoint;
		}
		return totalPerimeter;
	}

	// Sample a point on the curve using a parameter t (from 0 to 1)
	samplePoint(t) {
		let n = this.points.length;
		let p0 = this.points[0];
		let p1 = this.points[1 % n];
		let p2 = this.points[2 % n];
		let p3 = this.points[3 % n];

		// Using Catmull-Rom spline for smooth interpolation between points
		let x = 0.5 * ((2 * p1.x) + (-p0.x + p2.x) * t + (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t * t + (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t * t * t);
		let y = 0.5 * ((2 * p1.y) + (-p0.y + p2.y) * t + (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t * t + (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t * t * t);

		return createVector(x, y);
	}
}

window.Curve = Curve;