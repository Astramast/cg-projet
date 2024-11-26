function findPQCurve(polygon, p) {

	let enclosingCircle = Circle.fromEnclosingPolygon(polygon);

	if (p >= enclosingCircle.perimeter()) {
		return Circle.fromCenterPerimeter(enclosingCircle.center, p);
	}

	let fpvd = polygon.getFPVD();

	return null;
}
