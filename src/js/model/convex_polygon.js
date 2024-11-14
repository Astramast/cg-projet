class ConvexPolygon {
	constructor(points) {
		this.points = points;// points are assumed to be correct and in-order.
	}
	draw() {
		for (let i = 0; i < this.points.length; i++) {
			line(this.points[i].x, this.points[i].y, this.points[(i + 1) % this.points.length].x, this.points[(i + 1) % this.points.length].y);
		}
	}
	getStartingFPVD(p, q, r) {
		perpendicular_bisectors = [perpendicularBisector(p, q), perpendicularBisector(q, r), perpendicularBisector(r, p)];
		root = perpendicular_bisectors[0].intersect(perpendicular_bisectors[1]);
		let points = [root];
		let edges = [];
		for (let i = 0; i < 3; i++) {
			let a = perpendicular_bisectors[i].a;
			let b = perpendicular_bisectors[i].b;
			if (a.distance(input[i]) > a.distance(input[i + 2 % 3])) {
				points.push(a);
				edges.push((root, a));
			}
			else {
				points.push(b);
				edges.push((root, b));
			}
		}
		return Tree([points, edges]);
	}
	//Farthest-Point Voronoi Diagram
	getFPVD() {
		if (this.points.length <= 1) {
			return Tree(this.points, null);
		}
		if (this.points.length == 2) {
			return Tree(this.points, perpendicularBisector(this.points[0], this.points[1]));
		}
		if (this.points.length == 3) {
			return getStartingFPVD(this.points[0], this.points[1], this.points[2]);
		}
		let tree = getStartingFPVD(this.points[0], this.points[1], this.points[2]);
	}
}

function perpendicularBisector(p, q) {
	
}

window.ConvexPolygon = ConvexPolygon;
window.perpendicularBisector = perpendicularBisector;
