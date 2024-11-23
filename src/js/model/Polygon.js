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
		if (this.points.length < 2) return 0;
		let n = this.points.length;
		let p = this.points[0].dist(this.points[n - 1]);
		for (let i = 0; i < n - 1; i++) {
			p += this.points[i].dist(this.points[i + 1]);
		}
		return p;
	}

	area() {
		if (this.points.length < 3) return 0;
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

	convexify() {
		let new_points = [];
		let convex_hull = computeConvexHull(Array.from(this.points));
		for (let p of this.points) {
			if (convex_hull.includes(p)) {
				new_points.push(p);
			} else {
				let a = this.getPreviousConvexHullPoint(p, convex_hull);
				let b = this.getNextConvexHullPoint(p, convex_hull);
				console.log(a, b);
				new_points.push(p.getSymmetricPoint(new Line(a, b)));
			}
		}
		return new Polygon(new_points);
	}

	getNeighbourConvexHullPoint(p, left, hull) {
		let index = this.points.indexOf(p);
		let n = this.points.length;
		for (let i = 1; i < n; i++) {
			let search_index = 0;
			if (left) {
				search_index = index - i;
			} else {
				search_index = index + i;
			}
			search_index = (search_index + n) % n;
			if (hull.includes(this.points[search_index])) {
				return this.points[search_index];
			}
		}
	}

	getPreviousConvexHullPoint(p, hull) {
		return this.getNeighbourConvexHullPoint(p, true, hull);
	}

	getNextConvexHullPoint(p, hull) {
		return this.getNeighbourConvexHullPoint(p, false, hull);
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