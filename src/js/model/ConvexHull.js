class ConvexHull {
	constructor(points) {
		this.points = this.grahamScan(points);
	}
	draw(p){
		for (let i = 0; i < this.points.length; i++) {
			this.points[i].draw();
			let a = this.points[i];
			let b = this.points[(i + 1) % this.points.length];
			p.line(a.x, a.y, b.x, b.y);
		}
	}
	getSmallestEnclosingCircle() {
		let circles = this.generateCircles();
		circles.filter((c) => this.inCircle(c));
		let smallestCircle = this.findSmallestCircle(circles);
		return smallestCircle;
	}
	generateCircles() {
		let circles = [];
		for (let i = 0; i < this.points.length; i++) {
			for (let j = i + 1; j < this.points.length; j++) {
				let circle2 = Circle.fromTwoPoints(this.points[i], this.points[j]);
				circles.push(circle2);
				for (let k = j + 1; k < this.points.length; k++) {
					let circle3 = Circle.fromThreePoints(this.points[i], this.points[j], this.points[k]);
					circles.push(circle3);
				}
			}
		}
		return circles;
	}
	inCircle(circle) {
		for (let i = 0; i < this.points.length; i++) {
			if (!this.points[i].inCircle(circle)) {
				return false;
			}
		}
		return true;
	}
	findSmallestCircle(circles) {
		let smallestCircle = circles[0];
		for (let i = 1; i < circles.length; i++) {
			if (circles[i].radius < smallestCircle.radius) {
				smallestCircle = circles[i];
			}
		}
		return smallestCircle;
	}
	grahamScan(points){
		if (points.length <= 1) return points;
		let sortedPoints = this.getSortedPoints(points);
		let convexHull = [sortedPoints[0], sortedPoints[1]];
		for (let i = 2; i < sortedPoints.length; i++) {
			this.grahamStep(convexHull, sortedPoints[i]);
		}
		return convexHull;
	}
	grahamStep(points, newPoint){
		let a = points[points.length - 2];
		let b = points[points.length - 1];
		while (points.length >= 2 && a.getOrientationDeterminantSign(b, newPoint) >= 0) {
			points.pop();
			a = points[points.length - 2];
			b = points[points.length - 1];
		}
		points.push(newPoint);
	}
	getSortedPoints(points) {
		let copy = Array.from(points);
		let leftmostPoint = this.findLeftmostPoint(copy);
		copy.filter((p) => p.isEqual(leftmostPoint));
		copy.sort(leftmostPoint.leftRadialComparator.bind(leftmostPoint));
		copy.unshift(leftmostPoint);
		return copy;
	}
	findLeftmostPoint(points){
		let leftmostPoint = points[0];
		for (let i = 1; i < points.length; i++) {
			if (points[i].x < leftmostPoint.x) {
				leftmostPoint = points[i];
			}
		}
		return leftmostPoint;
	}
	toPolygon(){
		return new Polygon(this.points);
	}
}