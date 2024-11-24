class VoronoiCell {
	constructor(semiLine1, semiLine2, segments) {
		this.semiLine1 = semiLine1;
		this.semiLine2 = semiLine2;
		this.segments = segments;
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

function computeVoronoiCell3(p, q, r) {

	console.log(p, q, r);

	let bissectorPQ = perpendicularBisector(p, q);
	let bissectorPR = perpendicularBisector(p, r);

	let intersection = bissectorPQ.getIntersection(bissectorPR);

	// TODO: Change that
	let point_infinite_line_pq = new Point(p.x + 1000 * (q.x - p.x), p.y + 1000 * (q.y - p.y));
	let point_infinite_line_pr = new Point(p.x + 1000 * (r.x - p.x), p.y + 1000 * (r.y - p.y));


	let semiLine1 = new SemiLine(intersection, point_infinite_line_pq);
	let semiLine2 = new SemiLine(intersection, point_infinite_line_pr)

	console.log(semiLine1, semiLine2);
	return new VoronoiCell(semiLine1, semiLine2, []);
}