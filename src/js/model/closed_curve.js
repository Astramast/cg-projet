class ClosedCurve extends Curve {
	constructor(points = [], segments = 100) {
		super(points, segments);
	}

	// Override the draw method to close the curve
	draw() {
		if (this.points.length < 3) return;

		noFill();
		beginShape();
		// Use curveVertex for smooth curves (closed path)
		for (let i = 0; i < this.points.length; i++) {
			curveVertex(this.points[i].x, this.points[i].y);
		}
		// Close the shape by connecting the last point to the first one
		curveVertex(this.points[0].x, this.points[0].y);
		endShape(CLOSE);
	}

	// Calculate the perimeter by approximating the smooth curve using sampled points
	perimeter() {
		let totalPerimeter = 0;
		let prevPoint = this.samplePoint(0); // Sample point at t = 0
		for (let i = 1; i <= this.segments; i++) {
			let t = i / this.segments;
			let sampledPoint = this.samplePoint(t);
			totalPerimeter += prevPoint.dist(sampledPoint);
			prevPoint = sampledPoint;
		}
		return totalPerimeter;
	}

	// Calculate the area using the Shoelace formula on sampled points
	area() {
		let area = 0;
		let prevPoint = this.samplePoint(0);
		for (let i = 1; i <= this.segments; i++) {
			let t = i / this.segments;
			let sampledPoint = this.samplePoint(t);
			area += prevPoint.x * sampledPoint.y - sampledPoint.x * prevPoint.y;
			prevPoint = sampledPoint;
		}
		return Math.abs(area) / 2;
	}
}

window.ClosedCurve = ClosedCurve;