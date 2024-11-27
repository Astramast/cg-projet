class FarthestPointVoronoiDiagram {
	constructor(sites) {
		this.sites = [];
		this.points = [];
		this.lines = [];
		if (sites.length == 1) {
			this.sites = sites;
			return;
		} else if (sites.length == 2) {
			this.sites = sites;
			this.lines.push(sites[0].getPerpendicularBisector(sites[1]));
			return;
		}
		let ch = new ConvexHull(sites).points;
		let copy = ch.slice();
		let vertices = [];
		for (let i = 0; i < ch.length - 3; i++) {
			const randomIndex = Math.floor(Math.random() * copy.length);
			const randomPoint = copy[randomIndex];
			const prevPoint = copy[(randomIndex - 1 + copy.length) % copy.length];
			const nextPoint = copy[(randomIndex + 1) % copy.length];
			vertices.push([randomPoint, prevPoint, nextPoint]);
			copy.splice(randomIndex, 1);
		}
		this.fpvd3constructor(copy[0], copy[1], copy[2]);
		for (let i = vertices.length - 1; i >= 0; i--) {
			let p_i = vertices[i][0];
			let prev_p_i = vertices[i][1];
			let next_p_i = vertices[i][2];
			console.log("p_i, prev_p_i, next_p_i", JSON.parse(JSON.stringify(p_i)), JSON.parse(JSON.stringify(prev_p_i)), JSON.parse(JSON.stringify(next_p_i)));
			console.log("sites", JSON.parse(JSON.stringify(this.sites)));
			this.addPoint(p_i, prev_p_i, next_p_i);
		}
	}
	fpvd3constructor(p1, p2, p3) {
		let bisectors = [p1.getPerpendicularBisector(p2), p2.getPerpendicularBisector(p3)];
		let c = bisectors[0].getIntersection(bisectors[1]);
		this.points = [c];
		this.sites = [p1, p2, p3];
		this.lines = [];
		console.log("p1, p2, p3, c", JSON.parse(JSON.stringify(p1)), JSON.parse(JSON.stringify(p2)), JSON.parse(JSON.stringify(p3)), JSON.parse(JSON.stringify(this.points[0])));
		this.lines.push(this.getGoodSemiline(p1, p2, p3, c.copy()));
		this.lines.push(this.getGoodSemiline(p2, p3, p1, c.copy()));
		this.lines.push(this.getGoodSemiline(p3, p1, p2, c.copy()));
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
			console.log("cw, ccw, sites", JSON.parse(JSON.stringify(cw)), JSON.parse(JSON.stringify(ccw)), JSON.parse(JSON.stringify(this.sites)));
			throw new Error("Neighbours are not sites of the Voronoi Diagram !");
		}
		let k = ccw;
		let intersection_points = [];
		let intersection_lines_indexes = [];
		let kValues = [ccw];
		while (!k.isEqual(cw)) {
			console.log("k, cw", JSON.parse(JSON.stringify(k)), JSON.parse(JSON.stringify(cw)));
			let B_kp = p.getPerpendicularBisector(k);
			let kCell = this.getCellFromSite(k);
			let q = null;
			let b = null;
			for (let l of kCell.cell) {
				q = l.getLineIntersection(B_kp);
				if (q != null) {
					let isAlreadyKnown = false;
					for (let int_point of intersection_points) {
						if (int_point.isEqual(q)) {
							isAlreadyKnown = true;
							break;
						}
					}
					if (!isAlreadyKnown) {
						b = l;
						intersection_points.push(q);
						intersection_lines_indexes.push(this.lines.indexOf(l));
						break;
					}
				}
			}
			if (b == null) {
				break;
			}
			for (let s of this.sites) {
				if (k.isEqual(s)) continue;
				let bisector = s.getPerpendicularBisector(k);
				if (bisector.isEqual(b)) {
					k = s;
					break;
				}
			}
			console.log("q, b, k", JSON.parse(JSON.stringify(q)), JSON.parse(JSON.stringify(b)), JSON.parse(JSON.stringify(k)));
			console.log("intersection_points", JSON.parse(JSON.stringify(intersection_points)));
			if (kValues.includes(k)) {
				throw new Error("Loop detected");
			}
		}
		//Construct the cell of p
		let cell_segments = [];
		let cell_semilines = [];
		for (let i = 1; i < intersection_points.length; i++) { // If length is 1 loop is skipped
			cell_segments.push(new Segment(intersection_points[i - 1], intersection_points[i]));
		}
		cell_semilines.push(this.getGoodSemiline(p, ccw, cw, intersection_points[0]));
		cell_semilines.push(this.getGoodSemiline(p, cw, ccw, intersection_points[intersection_points.length - 1]));
		console.log("cell_semilines", JSON.parse(JSON.stringify(cell_semilines)));
		console.log("cell_segments", JSON.parse(JSON.stringify(cell_segments)));
		let pCell = new VoronoiCell(cell_semilines, cell_segments);
		console.log("pCell", JSON.parse(JSON.stringify(pCell.cell)));
		//Modify intersected lines
		console.log("lines before", JSON.parse(JSON.stringify(this.lines)));
		for (let i = 0; i < intersection_lines_indexes.length; i++) {
			let old_line = this.lines[intersection_lines_indexes[i]];
			let i_p = intersection_points[i];
			let new_line1 = null;
			let new_line2 = null;
			if (old_line instanceof SemiLine) {
				console.log("old_line is semiline", JSON.parse(JSON.stringify(old_line)));
				let v = new Point(old_line.b.x - old_line.a.x, old_line.b.y - old_line.a.y);
				let i_pv = new Point(i_p.x + v.x, i_p.y + v.y);
				new_line1 = new Segment(old_line.a.copy(), i_p.copy());
				new_line2 = new SemiLine(i_p.copy(), i_pv.copy());
			} else {
				new_line1 = new Segment(old_line.a.copy(), i_p.copy());
				new_line2 = new Segment(i_p.copy(), old_line.b.copy());
			}
			this.lines[intersection_lines_indexes[i]] = new_line1;
			this.lines.push(new_line2);
		}
		console.log("lines after replacement", JSON.parse(JSON.stringify(this.lines)));
		//Drop the lines inside the cell
		let new_lines = [];
		for (let each_line of this.lines) {
			if (!pCell.isPointStrictlyInside(each_line.a) && !pCell.isPointStrictlyInside(each_line.b)) {
				new_lines.push(each_line);
			}
		}
		this.lines = new_lines;
		console.log("lines after drop", JSON.parse(JSON.stringify(this.lines)));
		//Add the lines of the cell
		for (let l of pCell.cell) {
			this.lines.push(l);
		}
		console.log("lines after addition", JSON.parse(JSON.stringify(this.lines)));
		//Drop the points inside the cell
		for (let bad_point of this.points) {
			if (pCell.isPointStrictlyInside(bad_point)) {
				this.points.splice(this.points.indexOf(bad_point), 1);
			}
		}
		//Add the intersection points
		for (let good_point of intersection_points) {
			this.points.push(good_point);
		}
		//Add p to the sites
		this.sites.push(p);
	}
	getBisectors(p) {
		let bisectors = [];
		for (let i = 0; i < this.sites.length; i++) {
			let q = this.sites[i];
			if (q.isEqual(p)) continue; 
			bisectors.push(p.getPerpendicularBisector(q));
		}
		return bisectors;
	}
	getCellFromSite(p) {
		if (!this.sites.includes(p)) {
			throw new Error("Point is not a site of the Voronoi Diagram !")
		}
		let bisectors = this.getBisectors(p);
		console.log("Bisectors", JSON.parse(JSON.stringify(bisectors)));
		let semilines = [];
		let segments = [];
		for (let b of bisectors) {
			for (let l of this.lines) {
				if (b.isEqual(l)) {
					if (l instanceof SemiLine) {
						semilines.push(l);
					} else {
						segments.push(l);
					}
					break;
				}
			}
		}
		console.log("Semilines", JSON.parse(JSON.stringify(semilines)));
		console.log("Segments", JSON.parse(JSON.stringify(segments)));
		console.log("Lines", JSON.parse(JSON.stringify(this.lines)));
		let cell = new VoronoiCell(semilines, segments);
		return cell;
	}
}

