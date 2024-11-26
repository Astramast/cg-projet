class ConvexHull{
	constructor(points){ //Graham scan
		this.points = [];
		if (points.length <= 2) {
			this.points = points;
		}
		let copy = points.slice();
		let minX = getMinimalX(copy);
		copy = copy.filter((x) => x !== minX);
		copy.sort(minX.leftRadialComparator.bind(minX));
		copy.unshift(minX);
		result = [copy[0], copy[1]];
		for (let i = 2; i < copy.length; i++) {
			while (result.length >= 2 && result[result.length-2].getOrientationDeterminantSign(result[result.length-1], copy[i]) >= 0) {
				result.pop();
			}
			result.push(copy[i]);
		}
		this.points = result;
	}
	getMinimalX(points){
		let minX = points[0];
		for (let i = 1; i < points.length; i++) {
			if (points[i].x < minX.x) {
				minX = points[i];
			}
		}
		return minX;
	}
}

window.ConvexHull = ConvexHull;
