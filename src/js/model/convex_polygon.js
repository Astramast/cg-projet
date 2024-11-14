class ConvexPolygon {
	constructor(points) {
		this.points = points;// points are assumed to be correct and in-order.
	}
	draw() {
		for (let i = 0; i < this.points.length; i++) {
			line(this.points[i].x, this.points[i].y, this.points[(i + 1) % this.points.length].x, this.points[(i + 1) % this.points.length].y);
		}
	}
	getStartingFPVD(p, q, r) {
		
	}
	//Farthest-Point Voronoi Diagram
	getFPVD() {
		if (this.points.length == 1) {
			return this.points;
		}
		if (this.points.length == 2) {
			return perpendicularBisector(this.points[0], this.points[1]);
		}
		if (this.points.length == 3) {
			return getStartingFPVD(this.points[0], this.points[1], this.points[2]);
		}
	}
}

function perpendicularBisector(p1, p2) {
	
}

window.ConvexPolygon = ConvexPolygon;
window.perpendicularBisector = perpendicularBisector;
