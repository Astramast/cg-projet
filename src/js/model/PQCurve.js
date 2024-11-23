function findPQCurve(polygon, desiredPerimeter) {
	// Compute the farthest-point Voronoi diagram vertices
	let voronoiVertices = polygon.getFPVD();

	if (!voronoiVertices || voronoiVertices.length === 0) {
		console.error("Voronoi diagram computation failed or returned no vertices.");
		return null;
	}

	// Start building the PQ curve by selecting vertices until the perimeter condition is met
	let pqCurve = [];
	let currentPerimeter = 0;

	for (let i = 0; i < voronoiVertices.length; i++) {
		if (pqCurve.length > 0) {
			currentPerimeter += dist(
				pqCurve[pqCurve.length - 1].x, pqCurve[pqCurve.length - 1].y,
				voronoiVertices[i].x, voronoiVertices[i].y
			);
		}
		pqCurve.push(voronoiVertices[i]);

		if (currentPerimeter >= desiredPerimeter) {
			break;
		}
	}

	// Close the curve if possible
	if (pqCurve.length > 1 && currentPerimeter < desiredPerimeter) {
		currentPerimeter += dist(
			pqCurve[pqCurve.length - 1].x, pqCurve[pqCurve.length - 1].y,
			pqCurve[0].x, pqCurve[0].y
		);
		if (currentPerimeter <= desiredPerimeter) {
			pqCurve.push(pqCurve[0]);
		}
	}

	return new ClosedCurve(pqCurve);
}
