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
		let maximum = this.findMaximum(perimeter);
		let minimum = this.smallestEnclosingCircle.radius;
		let i = (maximum + minimum)/2;
		while (Math.abs(maximum - minimum) > 1e-6){
			let phiR = this.computePhiR(i);
			let phiRPerimeter = phiR.getPerimeter();
			if (Math.abs(phiRPerimeter - perimeter) < 1e-6){
				return phiR;
			}
			if (phiRPerimeter > perimeter){
				minimum = i;
			} else {
				maximum = i;
			}
			i = (maximum + minimum)/2;
		}
		throw new Error("Could not compute curve");
	}
	findMaximum(perimeter){
		let maximum = this.smallestEnclosingCircle.radius;
		while (this.computePhiR(maximum).getPerimeter() < perimeter){
			maximum *= 2;
		}
		return maximum;
	}
	computePhiR(r){
		let X_r = [];
		for (let i=0; i<this.convexHull.points.length; i++){
			let a = this.convexHull.points[i];
			let b = this.convexHull.points[(i+1)%this.convexHull.points.length];
			let candidates = a.getEquidistantPoints(b, r);
			let x = null;
			if a.getOrientationDeterminantSign(b, candidates[0]) > 0{
				x = candidates[1];
			} else {
				x = candidates[0];
			}
			let isXInFPVD = true;
			for (let j=0; j<this.convexHull.points.length; j++){
				let p = this.convexHull.points[j];
				if (p.isEqual(a) || p.isEqual(b)){
					continue;
				}
				if (x.euclidianDistance(p) > r){
					isXInFPVD = false;
					break;
				}
			}
			if (!isXInFPVD){
				continue;
			}
			X_r.push(x);
		}
		return new CircleUnion(X_r, r);
	}
}
