class VoronoiCell {
	constructor(semilines, segments) {
		console.log("semilines, segments", semilines, segments);
		this.cell = [];
		if (semilines[0].b.getOrientationDeterminantSign(semilines[1].a, semilines[1].b) > 0) {
			this.cell.push(semilines[1]);
			this.cell.push(semilines[0]);
		} else {
			this.cell.push(semilines[0]);
			this.cell.push(semilines[1]);
		}
		let chosen = this.cell[0];
		while (segments.length > 0) {
			for (let s of segments) {
				if (s.a.isEqual(chosen.a) || s.a.isEqual(chosen.b) || s.b.isEqual(chosen.a) || s.b.isEqual(chosen.b)) {
					this.cell.push(s);
					segments.splice(segments.indexOf(s), 1);
					chosen = s;
					break;
				}
			}
		}
		this.cell.push(this.cell.shift());
	}
	isPointStrictlyInside(p) {
		let isInside = true;
		let a = this.cell[0].b;
		let b = this.cell[0].a;
		let i = 0;
		while (isInside && i < this.cell.length) {
			isInside = a.getOrientationDeterminantSign(b, p) > 0;
			a = b;
			if (i + 1 < this.cell.length) {
				if (this.cell[i + 1].a.isEqual(a)) {
					b = this.cell[i + 1].b;
				} else {
					b = this.cell[i + 1].a;
				}
			}
			i++;
		}
		return isInside;
	}
}


function getIntersectionPoint(line1, line2) {
	// Assuming intersectLineLine is modified to return intersection point
	let t = intersectLineLine(line1, line2);
	if (t) {
		return new Point(line1.a.x + t * (line1.b.x - line1.a.x), line1.a.y + t * (line1.b.y - line1.a.y));
	}
	return null;
}

function isInsideHalfPlane(segment, bisector, p) {
	let orientation = bisector.a.orientationDeterminant(bisector.b, p);
	return orientation > 0;
}

function computeVoronoiCell(p, points) {

	let bisectors = [];
	for (let i = 0; i < points.length; i++) {
		let q = points[i];
		if (q === p) continue;
		let bisector = perpendicularBisector(p, q);
		bisectors.push(bisector);
	}
	cell = new VoronoiCell(null, [], null);

	// TODO: Implement the rest of the function

	return cell;
}


window.VoronoiCell = VoronoiCell;
