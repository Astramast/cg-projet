class VoronoiDiagram {
	constructor(points, semilines, sites) {
		this.points = points;
		this.semilines = semilines;
		this.sites = sites;
	}

	draw(canvas) {
		for (let p of this.points) {
			p.draw(canvas);
		}
		for (let l of this.semilines) {
			l.draw(canvas);
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
		if (semilines.length != 2) {
			throw new Error("Only one semiline found for p !")
		}
		return new VoronoiCell(semilines[0], semilines[1], segments);
	}
}
