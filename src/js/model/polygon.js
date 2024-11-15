class Polygon {
	constructor(points = []) {
		this.points = points;
	}

	// Add a point to the polygon
	addPoint(point) {
		this.points.push(point);
	}

	doesNotIntersect(p) {
		let n = this.points.length;
		let firstPoint = this.points[0];
		let lastPoint = this.points[n - 1];

		for (let i = 0; i < n - 1; i++) {
			let p1 = this.points[i];
			let p2 = this.points[i + 1];
			if (
				doIntersect(p1, p2, lastPoint, p) ||
				doIntersect(p1, p2, firstPoint, p)
			) {
				return false; // The polygon is no longer simple
			}
		}
		return true;
	}

	perimeter() {
		let n = this.points.length;
		let p = euclidianDist(this.points[0], this.points[n - 1]);
		for (let i = 0; i < n - 1; i++) {
			p += euclidianDist(this.points[i], this.points[i + 1]);
		}
		return p;
	}

	area() {
		let n = this.points.length;
		let a = 0;
		for (let i = 0; i < n - 1; i++) {
			a += this.points[i].x * this.points[i + 1].y - this.points[i + 1].x * this.points[i].y;
		}
		a += this.points[n - 1].x * this.points[0].y - this.points[0].x * this.points[n - 1].y;
		return Math.abs(a) / 2;
	}


	getFPVD() {
		// TODO: Implement the farthest-point Voronoi diagram algorithm
		return this.points;
	}


}

function doIntersect(p1, p2, p3, p4) {
	const crossProduct = (o, a, b) => (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
	let o1 = crossProduct(p1, p2, p3);
	let o2 = crossProduct(p1, p2, p4);
	let o3 = crossProduct(p3, p4, p1);
	let o4 = crossProduct(p3, p4, p2);
	return o1 * o2 < 0 && o3 * o4 < 0;
}

function euclidianDist(p1, p2) {
	return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
}


window.Polygon = Polygon;