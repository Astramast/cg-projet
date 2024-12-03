class PQCurve{
	constructor(points){
		this.convexHull = new ConvexHull(points);
		this.smallestEnclosingCircle = this.convexHull.getSmallestEnclosingCircle();
	}
	getCurve(perimeter){
		let convexHullPerimeter = this.convexHull.getPerimeter();
		if (convexHullPerimeter < perimeter){
			return null;
		}
		if (convexHullPerimeter == perimeter){
			return this.convexHull;
		}
		if (perimeter >= this.smallestEnclosingCircle.getPerimeter()){
			return Circle(this.smallestEnclosingCircle.center, perimeter/(2*Math.PI));
		}
		return this.computeCurve(perimeter);
	}
	computeCurve(perimeter){
	}
}
