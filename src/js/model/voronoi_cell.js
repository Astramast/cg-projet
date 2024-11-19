
class VoronoiCell {
	constructor(semiLine1, segments, semiLine2) {
		this.semiLine1 = semiLine1;
		this.segments = segments;
		this.semiLine2 = semiLine2;
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