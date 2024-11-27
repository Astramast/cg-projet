class CauchyArmLemmaCanvasUI extends CanvasUI {
	constructor(p) {
		super(p);
		this.points = [];
		this.nbAngleToStretchangle = 1;
		this.polygonStretched = null;
		this.acceptInput = true;
	}

	refuseInput() {
		this.acceptInput = false;
	}

	setup() {
		// Buttons for user interaction
		this.stretchButton = new Button("Stretch", this.canvasPosition.x + 110, this.canvasPosition.y, () => {this.Stretch(); this.refuseInput();}, this.p);
		this.clearButton = new Button("Clear", this.canvasPosition.x + 10, this.canvasPosition.y, () => this.resetPoints(), this.p);
	}

	resetPoints() {
		this.points = [];
		this.acceptInput = true;
		this.polygonStretched = null;
	}

	draw() {
		// Draw background
		this.p.background("#FFF9BF");

		// Draw the drawing area
		this.p.stroke("#CB9DF0");
		this.p.fill("#CB9DF0");
		this.p.rect(0, 80, this.p.width, this.p.height);

		// drawing lines
		this.p.stroke("#8E24AA");
		// this.p.fill("#ba76f1");
		this.p.noFill();
		this.p.beginShape();
		for (let p of this.points) {
			this.p.vertex(p.x, p.y);
		}
		this.p.endShape(this.p.CLOSE);

		// Draw points
		this.p.stroke("#FFF9BF");
		this.p.fill("#FFF9BF");
		for (let p of this.points) {
			this.p.ellipse(p.x, p.y, 6, 6);
		}
	

		if (this.polygonStretched != null) {

			// Draw points
			this.p.stroke("#FFF9BF");
			this.p.fill("#FFF9BF");
			for (let p of this.polygonStretched) {
				this.p.ellipse(p.x, p.y, 6, 6);
			}

			this.p.stroke("#FFF9BF");
			this.p.noFill();
			// this.p.fill("#ba76f1");
			this.p.beginShape();
			for (let p of this.polygonStretched) {
				this.p.vertex(p.x, p.y);
			}
			this.p.endShape(this.p.CLOSE);
		}

	}


	mousePressed() {
		if (!this.acceptInput || this.points.length >= 3) {return;}
		if (this.p.mouseX < 0 || this.p.mouseX > this.p.width || this.p.mouseY < 80 || this.p.mouseY > this.p.height) return;
		this.points.push(new Point(this.p.mouseX, this.p.mouseY));
		// console.log(this.points);
	}


	/////////////////////MAIN function////////////////////


	Stretch() {
		// this.testALL();
		this.polygonStretched = [...this.points]
		this.stretchTriangle(this.polygonStretched, 2)
		// this.testStretch(this.polygonStretched);
	}

	stretchTriangle(triangle, vertex_to_increase_angle) {
		let n = triangle.length;
		let start_vertex = (vertex_to_increase_angle - 1 + n) % n;
		this.stretchPolygon(triangle, start_vertex);
	}

	stretchPolygon(polygon, a) {  // works great, but only on triangles
		// stretch polygon at angle a-b-c 
		// a is the index of the reference vertex
		if (!this.isConvex(polygon)) {
			console.log("ERROR : isConvex failed");
			return;
		}

		let n = polygon.length;
		let b = (a + 1) % n;
		let c = (b + 1) % n;

		let theta = this.convertInDegree(this.getAngle(polygon[a], polygon[b], polygon[c]));
		let diff = 180 - theta;

		if (diff > 0) {
			this.printDistance(this.points, a, "distance before stretch :");
			polygon[c] = this.rotate(polygon[a], polygon[b], polygon[c]);
			this.printDistance(polygon, a, "distance after stretch (should stay unchanged) :");

		} else {
			console.log("ERROR : polygon not convex, angle diff non-positive :", diff, theta, a, b, c)
		}

	}


	////////////////UTILITY functions////////////////////


	isConvex(polygon) {
		let hull = computeConvexHull(polygon);
		let is_convex = (polygon.length == hull.length);

		if (!is_convex) {
			console.log("ERROR : polygon not convex, hull length :", hull.length, "polygon length :", polygon.length);
		} else {
			console.log("isConvex success")
		}
		return is_convex;
	}

	convertInDegree(angleRadiant) {
		return (angleRadiant * 180) / Math.PI;
	}

	getAngle(a, b, c) {  // return the result in radians
		// Calculate the angle formed by AB and BC

		const u = [b.x - a.x, b.y - a.y]; // Vector AB
		const v = [c.x - b.x, c.y - b.y]; // Vector BC

		const dotProduct = u[0] * v[0] + u[1] * v[1];

		const magnitudeU = Math.sqrt(u[0] ** 2 + u[1] ** 2);
		const magnitudeV = Math.sqrt(v[0] ** 2 + v[1] ** 2);

		let cosTheta = dotProduct / (magnitudeU * magnitudeV);

		// Handle potential floating-point inaccuracies
		cosTheta = Math.max(-1, Math.min(1, cosTheta));

		const angleRadians = Math.acos(cosTheta);

		return angleRadians;
	}

// 	rotate(a, b, c, factor = 1.1) {
//     // Vector BC
//     const vX = c.x - b.x;
//     const vY = c.y - b.y;

//     // Current vector length
//     const originalLength = this.getDistance(b, c);

//     // Determine the rotation angle (radians)
//     const delta = Math.acos(1 / factor); // Small rotation increment

//     // Ensure the new angle stays below 180° (angle between a, b, c)
//     const currentAngle = this.getAngle(a, b, c);
//     const newAngle = currentAngle + delta;
//     if (newAngle >= Math.PI) {
//         throw new Error("Angle enlargement exceeds 180°");
//     }

//     // Rotate vector BC counterclockwise
//     const cosDelta = Math.cos(delta);
//     const sinDelta = Math.sin(delta);
//     const rotatedVX = cosDelta * vX - sinDelta * vY;
//     const rotatedVY = sinDelta * vX + cosDelta * vY;

//     // Normalize the rotated vector to maintain the original length
//     const magnitude = Math.sqrt(rotatedVX * rotatedVX + rotatedVY * rotatedVY);
//     const normalizedVX = (rotatedVX / magnitude) * originalLength;
//     const normalizedVY = (rotatedVY / magnitude) * originalLength;

//     // Compute new position of C
//     const newX3 = b.x + normalizedVX;
//     const newY3 = b.y + normalizedVY;

//     return new Point(newX3, newY3);
// }

rotate(a, b, c, factor = 1.1) {
	// Vector AB and BC
	const abX = a.x - b.x;
	const abY = a.y - b.y;
	const bcX = c.x - b.x;
	const bcY = c.y - b.y;

	// Current vector length of BC
	const originalLength = this.getDistance(b, c);

	// Calculate current angle between AB and BC
	const currentAngle = this.getAngle(a, b, c);

	// Determine the rotation angle (radians)
	const delta = Math.acos(1 / factor); // Angle increment

	// Ensure the new angle stays below 180°
	const newAngle = currentAngle + delta;
	if (newAngle >= Math.PI) {
			throw new Error("Angle enlargement exceeds 180°");
	}

	// Determine rotation direction using the cross product
	const crossProduct = abX * bcY - abY * bcX; // z-component of cross product
	const rotationDirection = crossProduct > 0 ? 1 : -1; // Positive for counterclockwise, negative for clockwise

	// Rotate vector BC counterclockwise (or clockwise, depending on direction)
	const cosDelta = Math.cos(rotationDirection * delta);
	const sinDelta = Math.sin(rotationDirection * delta);
	const rotatedBCX = cosDelta * bcX - sinDelta * bcY;
	const rotatedBCY = sinDelta * bcX + cosDelta * bcY;

	// Normalize the rotated vector to maintain original length
	const magnitude = Math.sqrt(rotatedBCX * rotatedBCX + rotatedBCY * rotatedBCY);
	const normalizedBCX = (rotatedBCX / magnitude) * originalLength;
	const normalizedBCY = (rotatedBCY / magnitude) * originalLength;

	// Compute new position of C
	const newX3 = b.x + normalizedBCX;
	const newY3 = b.y + normalizedBCY;

	return new Point(newX3, newY3);
}


	getDistance(b, c) {
		const dx = b.x - c.x;
		const dy = b.y - c.y;
		return Math.sqrt(dx * dx + dy * dy);
	}

	printDistance(triangle, a, str) {  // we assume the polygon is a triangle
		let b = (a + 1) % 3;
		let c = (b + 1) % 3;
		console.log(str, (this.getDistance(triangle[a], triangle[b])).toFixed(0));
		console.log(str, (this.getDistance(triangle[b], triangle[c])).toFixed(0));
		console.log(str, (this.getDistance(triangle[c], triangle[a])).toFixed(0));

	}


	////////////////////TEST functions///////////////////


	testIsConvex() {
		let a = new Point(0, 0);
		let b = new Point(1, 0);
		let c = new Point(1, 1);
		let d = new Point(0, 1);
		let polygon = [a, b, c];
		let result = this.isConvex(polygon);
		if (!result) {
			console.log("ERROR : isConvex failed, result :", result)
		} else {
			console.log("isConvex success")
		}
	}

	testGetAngle() {
		let a = new Point(0, 0);
		let b = new Point(1, 0);
		let c = new Point(1, 1);
		let result = this.convertInDegree(this.getAngle(a, b, c));
		if (result !== 90) {
			console.log("ERROR : getAngle failed, result", result);
		} else {
			console.log("getAngle success");
		}
	}

	testRotate() {  // deprecated
		let origin = new Point(0, 0);
		let p = new Point(1, 0);
		let angle = 90;
		let result = this.convertInDegree(this.rotate(origin, p, angle));
		if (result.x != 0 || (result.y != 1 && result.y != -1)) {
			console.log("ERROR : rotate failed, result :", result)
		} else {
			console.log("rotate success")
		}
	}

	testALL() {
		this.testGetAngle();
		// this.testRotate();
		this.testIsConvex();
	}

}
