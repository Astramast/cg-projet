class ConvexPolygon {
	constructor(points) {
		this.points = points;// points are assumed to be correct and in-order.
	}
	draw() {
		for (let i = 0; i < this.points.length; i++) {
			line(this.points[i].x, this.points[i].y, this.points[(i + 1) % this.points.length].x, this.points[(i + 1) % this.points.length].y);
			this.points[i].draw();
		}
	}
	getStartingFPVD() {
		return new VoronoiDiagram(this.points[0], this.points[1], this.points[2]);
	}
	//Farthest-Point Voronoi Diagram
	getFPVD() {
		if (this.points.length <= 1) {
			return new VoronoiDiagram(this.points, null);
		}
		if (this.points.length == 2) {
			return new VoronoiDiagram(this.points, points[0].getPerpendicularBisector(points[1]));
		}
		if (this.points.length == 3) {
			return this.getStartingFPVD(this.points[0], this.points[1], this.points[2]);
		}
		this.sortPoints();
		let copy = this.points.slice();
		let vertices = {};
		for (let i = 0; i < this.points.length - 3; i++) {
			const randomIndex = Math.floor(Math.random() * copy.length);
			const randomPoint = copy[randomIndex];
			const prevPoint = copy[(randomIndex - 1 + copy.length) % copy.length];
			const nextPoint = copy[(randomIndex + 1) % copy.length];
			vertices[randomPoint] = [prevPoint, nextPoint];
			copy.splice(randomIndex, 1);
		}
		let fpvd = new VoronoiDiagram(copy[0], copy[1], copy[2]);
		for (let i = 3; i < this.points.length; i++) {
			let p_i = this.points[i];
			let prevPi = vertices[p_i][0];
			let nextPi = vertices[p_i][1];
			fpvd.add(p_i, prevPi, nextPi);
		}
		return fpvd;
	}
	findMinimumX() {
		let minX = this.points[0];
		for (let i = 0; i < this.points.length; i++) {
			if (this.points[i].x < minX.x) {
				minX = this.points[i];
			}
		}
		return minX;
	}
	sortPoints() {
		let minX = this.findMinimumX();
		this.points = this.points.filter((x) => x !== minX);
		this.points.sort(minX.leftRadialComparator.bind(minX));
		this.points.unshift(minX);
	}
}

window.ConvexPolygon = ConvexPolygon;
