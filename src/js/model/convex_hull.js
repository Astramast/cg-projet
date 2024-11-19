function computeConvexHull(points) {
	if (points.length < 3) return points; // Convex hull is not defined for fewer than 3 points

	points.sort((a, b) => a.x === b.x ? a.y - b.y : a.x - b.x);

	const crossProduct = (o, a, b) => (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);

	let lower = [];
	for (let p of points) {
		while (lower.length >= 2 && crossProduct(lower[lower.length - 2], lower[lower.length - 1], p) <= 0) {
			lower.pop();
		}
		lower.push(p);
	}

	let upper = [];
	for (let i = points.length - 1; i >= 0; i--) {
		const p = points[i];
		while (upper.length >= 2 && crossProduct(upper[upper.length - 2], upper[upper.length - 1], p) <= 0) {
			upper.pop();
		}
		upper.push(p);
	}

	upper.pop();
	lower.pop();
	return lower.concat(upper);
}

window.computeConvexHull = computeConvexHull;
