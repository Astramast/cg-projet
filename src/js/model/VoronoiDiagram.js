class VoronoiDiagram {
	constructor(points, semilines, sites, cells = []) {
		this.points = points;
		this.semilines = semilines;
		this.sites = sites;
		this.cells = cells;
	}

	static getCell(p, points, bounds) {
		let dualPoints = [
			new Line(bounds[0], bounds[1]).computeDualPoint(),
			new Line(bounds[1], bounds[2]).computeDualPoint(),
			new Line(bounds[2], bounds[3]).computeDualPoint(),
			new Line(bounds[3], bounds[0]).computeDualPoint()
		];

		// Step 1: Compute the dual points for bisector line
		for (let q of points) {
			if (p === q) {
				continue;
			}
			let bisector = perpendicularBisector(new Point(0, 0), new Point(q.x - p.x, q.y - p.y));
			let dual = bisector.computeDualPoint();
			dualPoints.push(dual);
		}

		// Step 2: Compute the convex hull of the dual points
		let hull = computeConvexHull(dualPoints);

		// Step 3: Each edge of hull corresponds to a vertex of the cell.
		let cell = [];
		for (let i = 0; i < hull.length; i++) {
			let q = new Line(hull[i], hull[(i + 1) % hull.length]).computeDualPoint()
			cell.push(new Point(q.x + p.x, q.y + p.y));
		}
		return cell;
	}

	static fromPoints(points, bounds) {
		let cells = [];

		if (points.length <= 1) {
			return new VoronoiDiagram(points, [], []);
		} else if (points.length === 2) {
			let sl = perpendicularBisector(points[0], points[1]);
			return new VoronoiDiagram(points, [], [], [[sl.a, sl.b]]);
		} else {
			for (let p of points) {
				cells.push(VoronoiDiagram.getCell(p, points, bounds));
			}
		}

		return new VoronoiDiagram(points, [], [], cells);
	}

	draw(canvas) {
		for (let p of this.points) {
			p.draw(canvas);
		}
		for (let cell of this.cells) {
			canvas.beginShape();
			canvas.noFill();
			for (let p of cell) {
				canvas.vertex(p.x, p.y);
			}
			canvas.endShape(canvas.CLOSE);
		}

	}

	getCellFromSite(p) {
		if (!this.sites.includes(p)) {
			throw new Error("Point is not a site of the Voronoi Diagram !")
		}
		let bisectors = [];
		for (let i = 0; i < this.points.length; i++) {
			let q = this.points[i];
			if (q === p) continue;
			let bisector = perpendicularBisector(p, q);
			bisectors.push(bisector);
		}
		let semilines = [];
		let segments = [];
		for (sl of this.semilines) {
			if (bisectors.isEqual(sl)) {
				semilines.push(sl);
			}
		}
		for (s of this.segments) {
			if (bisectors.isEqual(s)) {
				segments.push(s);
			}
		}
		if (semilines.length !== 2) {
			throw new Error("Only one semiline found for p !")
		}
		return new VoronoiCell(semilines[0], semilines[1], segments);
	}
}