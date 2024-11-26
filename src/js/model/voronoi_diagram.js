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
	getGoodSemiline(p, q, r, c) {
		let B = p.getPerpendicularBisector(q);
		if (B.a.getOrientationDeterminantSign(B.b, c) != 0) {
			throw new Error("Point c not on the bisector of pq.");
		}
		let v = new Point(B.b.x - B.a.x, B.b.y - B.a.y);
		let sym = null;
		let flag = false;
		if (B.a == c) {
			sym = B.b.getSymmetrical(c);
			flag = true;
		} else {
			sym = B.a.getSymmetrical(c);
		}
		let goodSign = p.getOrientationDeterminantSign(q, r);
		let ood = p.getOrientationDeterminantSign(c, sym);
		if (goodSign == ood) {
			return new SemiLine(c, sym);
		} else {
			if (flag) {
				return new SemiLine(c, B.b);
			} else {
				return new SemiLine(c, B.a);
			}
		}
	}
	addPoint(p, cw, ccw) {
		if (!this.sites.includes(cw) || !this.sites.includes(ccw)) {
			throw new Error("Neighbours are not sites of the Voronoi Diagram !");
		}
		let k = ccw;
		let intersection_points = [];
		let intersection_lines_indexes = [];
		while (!k.isEqual(cw)) {
			let B_kp = p.getPerpendicularBisector(k);
			let kCell = getCellFromSite(k);
			let q = null;
			let b = null;
			for (let l of kCell.cell) {
				q = l.getLineIntersection(B_kp);
				if (q != null && !intersection_points.includes(q)) {
					b = l;
					intersection_points.push(q);
					intersection_lines_indexes.push(this.lines.indexOf(l));
					break;
				}
			}
			let j = null;
			for (let s of this.sites) {
				if (k.isEqual(s)) continue;
				let bisector = s.getPerpendicularBisector(k);
				if (bisector.isEqual(b)) {
					j = s;
					break;
				}
			}
			k = j;
		}
		//Construct the cell of p
		let cell_segments = [];
		let cell_semilines = [];
		for (let i = 1; i < intersection_points.length; i++) { // If length is 1 loop is skipped
			cell_segments.push(new Segment(intersection_points[i - 1], intersection_points[i]));
		}
		cell_semilines.push(this.getGoodSemiline(p, ccw, cw, intersection_points[0]));
		cell_semilines.push(this.getGoodSemiline(p, cw, ccw, intersection_points[intersection_points.length - 1]));
		pCell = new VoronoiCell(cell_semilines, cell_segments);
		//Modify intersected lines
		for (let i = 0; i < intersection_lines_indexes.length; i++) {
			let old_line = this.lines[intersection_lines_indexes[i]];
			let i_p = intersection_points[i];
			let new_line = null;
			if (old_line instanceof SemiLine) {
				let v = new Point(old_line.b.x - old_line.a.x, old_line.b.y - old_line.a.y);
				let i_pv = new Point(i_p.x + v.x, i_p.y + v.y);
				new_line = new SemiLine(i_p, i_pv);
			} else {
				if (pCell.isPointStrictlyInside(old_line.a)) {
					new_line = new Segment(ip, old_line.b);
				} else {
					new_line = new Segment(old_line.a, ip);
				}
			}
			this.lines[intersection_lines_indexes[i]] = new_line;
		}
		//Drop the lines inside the cell
		for (let l of this.lines) {
			if (pCell.isPointStrictlyInside(l.a) || pCell.isPointStrictlyInside(l.b)) {
				this.lines.splice(this.lines.indexOf(l), 1);
			}
		}
		//Add p to the sites
		this.sites.push(p);
	}
	getBisectors(p) {
		let bisectors = [];
		for (let i = 0; i < this.sites.length; i++) {
			let q = this.sites[i];
			if (q.isEqual(p)) continue; 
			let bisector = q.getPerpendicularBisector(p);
			bisectors.push(bisector);
		}
		return bisectors;
	}
	getCellFromSite(p) {
		if (!this.sites.includes(p)) {
			throw new Error("Point is not a site of the Voronoi Diagram !")
		}
		let bisectors = this.getBisectors(p);
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
		let cell = VoronoiCell(semilines, segments);
		return cell;
	}
}

window.VoronoiDiagram = VoronoiDiagram;
