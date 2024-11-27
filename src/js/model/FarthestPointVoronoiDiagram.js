class FarthestPointVoronoiDiagram {

	constructor(sites, points, lines) {
		this.sites = sites;
		this.points = points;
		this.lines = lines;
	}

	static fromPoints(points) {
		if (points.length === 1) return new FarthestPointVoronoiDiagram([points[0]], [], []);
		else if (points.length === 2) return new FarthestPointVoronoiDiagram([points[0], points[1]], [], [points[0].getPerpendicularBisector(points[1])]);
		else if (points.length === 3) return FarthestPointVoronoiDiagram.from3Points(points[0], points[1], points[2]);

		// Compute the convex hull of the points
		let sites = computeConvexHull(Array.from(points));
		let copy = sites.slice();
		let vertices = [];
		for (let i = 0; i < sites.length - 3; i++) {
			const randomIndex = Math.floor(Math.random() * copy.length);
			const randomPoint = copy[randomIndex];
			const prevPoint = copy[(randomIndex - 1 + copy.length) % copy.length];
			const nextPoint = copy[(randomIndex + 1) % copy.length];
			vertices.push([randomPoint, prevPoint, nextPoint]);
			copy.splice(randomIndex, 1);
		}
		console.log("copy in fromPoints: ", copy);
		let fpvd = FarthestPointVoronoiDiagram.from3Points(copy[0], copy[1], copy[2]);
		for (let i = vertices.length - 1; i >= 0; i--) {
			let p_i = vertices[i][0];
			let prev_p_i = vertices[i][1];
			let next_p_i = vertices[i][2];
			fpvd.addPoint(p_i, prev_p_i, next_p_i);
		}
		return fpvd;
	}

	static from3Points(p1, p2, p3) {
		let sites = [p1, p2, p3];
		let points = [p1.getPerpendicularBisector(p2).getIntersection(p2.getPerpendicularBisector(p3))];
		let lines = [
			getGoodSemiline(p1, p2, p3, points[0]),
			getGoodSemiline(p2, p3, p1, points[0]),
			getGoodSemiline(p3, p1, p2, points[0])
		];
		return new FarthestPointVoronoiDiagram(sites, points, lines);
	}

	draw(canvas) {
		for (let p of this.points) {
			p.draw(canvas);
		}
		for (let l of this.lines) {
			l.draw(canvas);
		}
	}

	addPoint(p, cw, ccw) {
		if (!this.sites.includes(cw) || !this.sites.includes(ccw)) {
			throw new Error("Neighbours are not sites of the Voronoi Diagram !");
		}
		let k = ccw;
		let intersection_points = [];
		let intersection_lines_indexes = [];
		let kValues = [ccw];
		while (!k.isEqual(cw)) {
			let B_kp = p.getPerpendicularBisector(k);
			let kCell = this.getCellFromSite(k);
			let q = null;
			let b = null;
			for (let l of kCell.cell) {
				q = l.getIntersection(B_kp);
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
		cell_semilines.push(getGoodSemiline(p, ccw, cw, intersection_points[0]));
		cell_semilines.push(getGoodSemiline(p, cw, ccw, intersection_points[intersection_points.length - 1]));
		let pCell = new VoronoiCell(cell_semilines, cell_segments);
		//Modify intersected lines
		for (let i = 0; i < intersection_lines_indexes.length; i++) {
			let old_line = this.lines[intersection_lines_indexes[i]];
			let i_p = intersection_points[i];
			let new_line1 = null;
			let new_line2 = null;
			if (old_line instanceof SemiLine) {
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
		//Drop the lines inside the cell
		let new_lines = [];
		for (let each_line of this.lines) {
			if (!pCell.isPointStrictlyInside(each_line.a) && !pCell.isPointStrictlyInside(each_line.b)) {
				new_lines.push(each_line);
			}
		}
		this.lines = new_lines;
		//Add the lines of the cell
		for (let l of pCell.cell) {
			this.lines.push(l);
		}
		//Recompute the vertices
		this.points = [];
		for (let l of this.lines) {
			if (!this.points.includes(l.a)){
				this.points.push(l.a);
			}
			if (l instanceof Segment) {
				if (!this.points.includes(l.b)){
					this.points.push(l.b);
				}
			}
		}
		//Add p to the sites
		this.sites.push(p);
	}

	getCellFromSite(p) {
		if (!this.sites.includes(p)) {
			throw new Error("Point is not a site of the Voronoi Diagram !")
		}
		let bisectors = this.getBisectors(p);
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
		return new VoronoiCell(semilines, segments);
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
}


function getGoodSemiline(p, q, r, c) {
	let bisector = p.getPerpendicularBisector(q);
	let sym = bisector.a === c ? bisector.b.getSymmetrical(c) : bisector.a.getSymmetrical(c);
	let goodSign = p.getOrientationDeterminantSign(q, r);
	let ood = p.getOrientationDeterminantSign(c, sym);
	return new SemiLine(c, goodSign === ood ? sym : (bisector.a === c ? bisector.b : bisector.a));
}
