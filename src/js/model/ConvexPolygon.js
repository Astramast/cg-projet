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
		let c1 = computeVoronoiCell3(p, q, r);
		let c2 = computeVoronoiCell3(q, r, p);
		let semilines = [c1.semiline1, c1.semiline2];
		for (let i = 0; i < semilines.length; i++) {
			if (semilines[i].isEqual(c2.semiline1)) {
				semilines.push(c2.semiline2);
				break;
			} else if (semilines[i].isEqual(c2.semiline2)) {
				semilines.push(c2.semiline1);
				break;
			}
		}
		return new VoronoiDiagram(c1.a, semilines);
	}

	//Farthest-Point Voronoi Diagram
	getFPVD() {
		if (this.points.length <= 1) {
			return new VoronoiDiagram(this.points, []);
		}
		if (this.points.length == 2) {
			return new VoronoiDiagram(this.points, perpendicularBisector(this.points[0], this.points[1]));
		}
		if (this.points.length === 3) {
			return this.getStartingFPVD(this.points[0], this.points[1], this.points[2]);
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
			prevVCell = fpvd.getCellFromSite(prevPi);
		}
	}
}

function perpendicularBisector(p, q) {
	// TODO: Assumed general position, complete code for extreme cases
	const y = (x) => ((2 * q.x - 2 * p.x) * x + (p.x ** 2 + p.y ** 2 - q.x ** 2 - q.y ** 2)) / (2 * p.y - 2 * q.y);
	return [new Line(new Point(0, y(0)), new Point(1, y(1)))];
}
