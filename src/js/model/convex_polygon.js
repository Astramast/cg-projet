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
		let c1 = computeVoronoiCell(p, [p, q, r]);
		let c2 = computeVoronoiCell(q, [p, q, r]);
		let semilines = [c1.semiline1, c1.semiline2];
		if (c1.semiline1.isEqual(c2.semiline1)) {
			semilines.push(c2.semiline2);
		}
		else {
			semilines.push(c2.semiline1);
		}
		return VoronoiDiagram([semilines[0].a], semilines);
	}
	//Farthest-Point Voronoi Diagram
	getFPVD() {
		if (this.points.length <= 1) {
			return Tree(this.points, null);
		}
		if (this.points.length === 2) {
			return Tree(this.points, perpendicularBisector(this.points[0], this.points[1]));
		}
		if (this.points.length === 3) {
			return this.getStartingFPVD(this.points[0], this.points[1], this.points[2]);
		}
		throw Error("not implemented"); // TODO
	}
}

function perpendicularBisector(p, q) {
	// TODO: Assumed general position, complete code for extreme cases
	const y = (x) => ((2*q.x - 2*p.x) * x + (p.x**2 + p.y**2 - q.x**2 - q.y**2)) / (2*p.y - 2*q.y);
	return new Line(new Point(0, y(0)), new Point(1, y(1)));
}

window.ConvexPolygon = ConvexPolygon;
window.perpendicularBisector = perpendicularBisector;
