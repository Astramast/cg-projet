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
		if (!this.sites.includes(cw) || !this.sites.includes(ccw)) {
			throw new Error("Neighbours are not sites of the Voronoi Diagram !");
		}
		this.sites.push(p);
		let B_cwccw = cw.getPerpendicularBisector(ccw);
		let ccwCell = getCellFromSite(ccw);
		let q = null;
		let b = null;
		for (let l of ccwCell) {
			q = l.getLineIntersection(B_cwccw);
			if (q != null) {
				b = l;
				break;
			}
		}
		let j = null;
		for (let s of this.sites) {
			if (ccw.isEqual(s)) continue;
			let bisector = s.getPerpendicularBisector(ccw);
			if (bisector.isEqual(b)) {
				j = s;
				break;
		}
	}
	getCellFromSite(p) {
		if (!this.sites.includes(p)) {
			throw new Error("Point is not a site of the Voronoi Diagram !")
		}
		bisectors = [];
		for (let i = 0; i < this.sites.length; i++) {
			let q = this.sites[i];
			if (q.isEqual(p)) continue; 
			let bisector = q.getPerpendicularBisector(p);
			bisectors.push(bisector);
		}
		let cell = [];
		let semilines = [];
		let segments = [];
		for (let b of bisectors) {
			for (let l of this.lines) {
				if (b.isEqual(l)) {
					if (l isinstanceof SemiLine) {
						semilines.push(l);
					} else {
						segments.push(l);
					}
					break;
				}
			}
		}
		if (semilines[0].b.getOrientationDeterminantSign(semilines[1].a, semilines[1].b) > 0) {
			cell.push(semilines[1]);
			cell.push(semilines[0]);
		} else {
			cell.push(semilines[0]);
			cell.push(semilines[1]);
		}
		let chosen = cell[0];
		while (segments.length > 0) {
			for (let s of segments) {
				if (s.a.isEqual(chosen.a) || s.a.isEqual(chosen.b) || s.b.isEqual(chosen.a) || s.b.isEqual(chosen.b)) {
					cell.push(s);
					segments.splice(segments.indexOf(s), 1);
					chosen = s;
					break;
				}
			}
		}
		cell.push(cell.shift());
		return cell;
	}
}

window.VoronoiDiagram = VoronoiDiagram;
