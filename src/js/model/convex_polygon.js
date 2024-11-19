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
		pCell = getVoronoiCell3(p, q, r);
		qCell = getVoronoiCell3(q, r, p);
		lines = [pCell.semiLine1, pCell.semiLine2];
		if (pCell.semiLine1.b.x == qCell.semiLine1.b.x && pCell.semiLine1.b.y == qCell.semiLine1.b.y) {
			lines.push(qCell.semiLine2);
		} else {
			lines.push(qCell.semiLine1);
		}
		return VoronoiDiagram(pCell.semiLine1.a, lines);
	}
	//Farthest-Point Voronoi Diagram
	getFPVD() {
		if (this.points.length <= 1) {
			return VoronoiDiagram(this.points, null);
		}
		if (this.points.length == 2) {
			return VoronoiDiagram(this.points, perpendicularBisector(this.points[0], this.points[1]));
		}
		if (this.points.length == 3) {
			return getStartingFPVD(this.points[0], this.points[1], this.points[2]);
		}
		let copy = this.points.slice();
		let vertices = {};
		for (let i = 0; i < this.points.length - 3; i++) {
			const randomIndex = Math.floor(Math.random() * copy.length);
			const randomPoint = copy[randomIndex];
			const prevPoint = copy[(randomIndex - 1 + copy.length) % copy.length];
			const nextPoint = copy[(randomIndex + 1) % copy.length];
			vertices[randomPoint] = [prevPoint, nextPoint];
			copy.splice(randomIndex, 1);
		}
		let fpvd = this.getStartingFPVD(copy[0], copy[1], copy[2]);
		for (let i = 3; i < this.points.length; i++) {
			p_i = this.points[i];
			prevPi = vertices[p_i][0];
			nextPi = vertices[p_i][1];
			
		}
	}
}

function perpendicularBisector(p, q) {
	//TODO Assumed general position, complete code for extreme cases
	const y = (x) => ((2*q.x - 2*p.x) * x + (p.x**2 + p.y**2 - q.x**2 - q.y**2)) / (2*p.y - 2*q.y);
	return Line(Point(0, y(0)), Point(1, y(1)));
}

window.ConvexPolygon = ConvexPolygon;
window.perpendicularBisector = perpendicularBisector;
