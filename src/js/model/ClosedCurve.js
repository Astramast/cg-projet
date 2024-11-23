class ClosedCurve extends Curve {
	constructor(points = [], segments = 100) {
		super(points, segments);
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
