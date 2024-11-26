function findPQCurve(polygon, p) {

	let enclosingCircle = Circle.fromEnclosingPolygon(polygon);

	if (p >= enclosingCircle.perimeter()) {
		return Circle.fromCenterPerimeter(enclosingCircle.center, p);
	}
	return null;

	// Definitions:
	// C: PQ curve with perimeter P
	// P: Desired perimeter
	// Q: Polygon
	// V(Q): Farthest-point Voronoi diagram of Q
	// B: Enclosing cicrle of Q with radius r_b
	// ρ(x): the radius of the minimum enclosing circle of Q with center x
	// φ_r: the intersection of all circles with radius r that enclose Q

	// Start computing the farthest-point Voronoi diagram
	let fpvd = polygon.getFPVD();

	// Sort the vertices of V(Q) by their value under ρ
	let sortedVertices = Array.from(fpvd.points).sort((a, b) => a.dist(enclosingCircle.center) - b.dist(enclosingCircle.center));

	// Then, we can approximate the radius of the arcs of C using a binary search for r in the set {ρ(v) : v is a vertex of V(Q)}.
	// That is, for a given r' in this set, compute φ_r' and its perimeter in O(n) time using Lemma 10.
	// Then, compare it with the value of P: If this perimeter is larger than P, then r > r0; otherwise, r ≤ r'.
	// In this way, we will find two vertices u and v of V(Q) such that ρ(u) < r < ρ(v).


	let left = 0;
	let right = sortedVertices.length - 1;

	while (left < right - 1) {
		let mid = Math.floor((left + right) / 2);

		// Compute φ_r and its perimeter for this candidate radius
		let phi = polygon.computeIntersectionOfCircles(polygon.getFarthestDistance(sortedVertices[mid]));
		let perimeter = phi.perimeter();

		if (perimeter > p) {
			// r > r0
			left = mid + 1;
		} else {
			// r ≤ r'
			right = mid;
		}
	}

	let u = sortedVertices[left];
	let v = sortedVertices[right];

	// Use a binary search in the interval [ρ(u), ρ(v)] to approximate the radius r
	let rhoU = polygon.getFarthestDistance(u);
	let rhoV = polygon.getFarthestDistance(v);
	let r = null;

	let epsilon = 1e-6;
	while (rhoV - rhoU > epsilon) {
		let midRadius = (rhoU + rhoV) / 2;

		// Compute φ_r and its perimeter for midRadius
		let phi = polygon.computeIntersectionOfCircles(midRadius);
		let perimeter = phi.perimeter();

		if (perimeter < p) {
			rhoU = midRadius;
		} else {
			rhoV = midRadius;
			r = midRadius;
		}
	}

	return polygon.computeIntersectionOfCircles(r);
}
