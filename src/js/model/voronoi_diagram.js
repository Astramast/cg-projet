class VoronoiDiagram {
	constructor(p1, p2, p3) {
		let bisectors = [p1.getPerpendicularBisector(p2), p2.getPerpendicularBisector(p3), p3.getPerpendicularBisector(p1)];
		this.points = [bisectors[0].getIntersection(bisectors[1])];
		this.sites = [p1, p2, p3];
		this.lines = [];
		for (let i = 0; i < 3; i++) {
			let symA = bisectors[i].a.getSymmetrical(this.points[0]);
			let flag = false;
			if (symA.isEqual(bisectors[i].a)) {
				symA = bisectors[i].b.getSymmetrical(this.points[0]);
				flag = true;
			}
			let ood_sites = this.sites[i].getOrientationDeterminantSign(this.sites[(i + 1) % 3], this.sites[(i + 2) % 3]);
			let ood_points = this.sites[i].getOrientationDeterminantSign(this.points[0], symA);
			if (ood_sites == ood_points) {
				this.lines.push(new SemiLine(this.points[0], symA));
			} else {
				if (flag) {
					this.lines.push(new SemiLine(this.points[0], bisectors[i].b));
				} else {
					
					this.lines.push(new SemiLine(this.points[0], bisectors[i].a));
				}
			}
		}
	}
	draw() {
		for (let p of this.points){
			p.draw();
		}
		for (let l of this.lines){
			l.draw();
		}
		for (let s of this.sites){
			s.draw();
		}
	}
	addPoint(p, cw, ccw) {
		//TODO
		return;
	}
	getCellFromSite(p) {
		if (!this.sites.includes(p)) {
			throw new Error("Point is not a site of the Voronoi Diagram !")
		}
		bisectors = [];
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

window.VoronoiDiagram = VoronoiDiagram;
