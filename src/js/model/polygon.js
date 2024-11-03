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
}

function doIntersect(p1, p2, p3, p4) {
	const crossProduct = (o, a, b) => (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
	let o1 = crossProduct(p1, p2, p3);
	let o2 = crossProduct(p1, p2, p4);
	let o3 = crossProduct(p3, p4, p1);
	let o4 = crossProduct(p3, p4, p2);
	return o1 * o2 < 0 && o3 * o4 < 0;
}


window.Polygon = Polygon;