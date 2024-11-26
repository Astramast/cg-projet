class CauchyArmLemmaCanvasUI extends CanvasUI {
	constructor(p) {
		super(p);
		this.points = [];
		this.nbAngleToStretchangle = 1;
		this.polygonStretched = null;
	}

	setup() {
		// Buttons for user interaction
		this.clearButton = new Button("Stretch", this.canvasPosition.x + 110, this.canvasPosition.y, () => this.Stretch(), this.p);
		this.clearButton = new Button("Clear", this.canvasPosition.x + 10, this.canvasPosition.y, () => this.resetPoints(), this.p);
	}

	resetPoints() {
		this.points = [];
		this.polygonStretched = null;
	}

	draw() {
		// Draw background
		this.p.background("#FFF9BF");

		// Draw the drawing area
		this.p.stroke("#CB9DF0");
		this.p.fill("#CB9DF0");
		this.p.rect(0, 80, this.p.width, this.p.height);

		// Draw points
		this.p.stroke("#FFF9BF");
		this.p.fill("#FFF9BF");
		for (let p of this.points) {
			this.p.ellipse(p.x, p.y, 6, 6);
		}

		if (this.polygonStretched != null) {
			this.p.stroke("#FFF9BF");
			this.p.noFill();
			// this.p.fill("#ba76f1");
			this.p.beginShape();
			for (let p of this.polygonStretched) {
				this.p.vertex(p.x, p.y);
			}
			this.p.endShape(this.p.CLOSE);
		}

		// drawing lines
		this.p.stroke("#8E24AA");
		// this.p.fill("#ba76f1");
		this.p.noFill();
		this.p.beginShape();
		for (let p of this.points) {
			this.p.vertex(p.x, p.y);
		}
		this.p.endShape(this.p.CLOSE);
	}


	mousePressed() {
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
		let start_vertex = (vertex_to_increase_angle -1 + n) % n;
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
			
		let theta = this.getAngle(polygon[a], polygon[b], polygon[c]);
		let diff = 180 - theta;
		
		if (diff > 0) {
			this.printDistance(polygon, a, "distance before stretch :");
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

	getAngle(a, b, c) {

    // Vectors AB and BC
    const u = [b.x - a.x, b.y - a.y]; // Vector AB
    const v = [c.x - b.x, c.y - b.y]; // Vector BC

    // Dot product of u and v
    const dotProduct = u[0] * v[0] + u[1] * v[1];

    // Magnitudes of u and v
    const magnitudeU = Math.sqrt(u[0] ** 2 + u[1] ** 2);
    const magnitudeV = Math.sqrt(v[0] ** 2 + v[1] ** 2);

    // Cosine of the angle
    let cosTheta = dotProduct / (magnitudeU * magnitudeV);

    // Handle potential floating-point inaccuracies
    cosTheta = Math.max(-1, Math.min(1, cosTheta));

    // Angle in radians
    const angleRadians = Math.acos(cosTheta);

    // Convert to degrees
    const angleDegrees = (angleRadians * 180) / Math.PI;

    return angleDegrees;
}

	rotate(a, b, c, factor = 1.1) {
		const [x1, y1] = [a.x, a.y];
		const [x2, y2] = [b.x, b.y];
		const [x3, y3] = [c.x, c.y];

		// Vector BC
		const vX = x3 - x2;
		const vY = y3 - y2;

		// Calculate the current angle
		const dotProduct = (x2 - x1) * vX + (y2 - y1) * vY;
		const magnitudeAB = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
		const magnitudeBC = Math.sqrt(vX ** 2 + vY ** 2);
		const currentCosTheta = dotProduct / (magnitudeAB * magnitudeBC);
		const currentAngle = Math.acos(currentCosTheta);

		// Determine the rotation angle
		const delta = Math.acos(1 / factor); // Rotation in radians

		// Ensure the new angle stays below 180°
		const newAngle = currentAngle + delta;
		if (newAngle >= Math.PI) {
			throw new Error("Angle enlargement exceeds 180°");
		}

		// Rotate vector BC slightly counterclockwise
		const cosDelta = Math.cos(delta);
		const sinDelta = Math.sin(delta);
		const newVX = cosDelta * vX - sinDelta * vY;
		const newVY = sinDelta * vX + cosDelta * vY;

		// Compute new position of C
		const newX3 = x2 + newVX;
		const newY3 = y2 + newVY;

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
		let result = this.getAngle(a, b, c);
		if (result !== 90) {
			console.log("ERROR : getAngle failed, result", result);
		} else {
			console.log("getAngle success");
		}
	}

	testRotate() {
		let origin = new Point(0, 0);
		let p = new Point(1, 0);
		let angle = 90;
		let result = this.rotate(origin, p, angle);
		if (result.x != 0 || (result.y != 1 && result.y != -1) ) {
			console.log("ERROR : rotate failed, result :", result)
		} else {
			console.log("rotate success")
		}
	}

	maxStretch(polygon) {  // for test only
		for (let a = 0;	a <= n-3; a++) {  // we do the maximum stretching of the edge [n-1, 0]
			try {
				this.stretchPolygon(polygon, a);
			} catch (e) {
				console.log("ERROR : stretchPolygon failed")
				// return;
			}
		}
	}

	testStretch(polygon) {  // not finished
		let n = polygon.length;
		let old_dist_to_stretch = this.getDistance(polygon[n-1], polygon[0]);
		let fixed_distances = [];
		for (let p = 0; p <= n-2; p++) {
			fixed_distances.push((this.getDistance(polygon[p], polygon[p+1])).toFixed(0));
		}

		// this.maxStretch(polygon);
		this.stretchTriangle(polygon, 2);

		let new_stretched_dist = this.getDistance(polygon[n-1], polygon[0]);

		if (new_stretched_dist != old_dist_to_stretch) {
			console.log("GOOD : the targeted edge has been stretched");
		}

		for (let p = 0; p <= n-2; p++) {  // we iterate over the points to be moved
			let old_dist = fixed_distances[p];
			let new_dist = (this.getDistance(polygon[p], polygon[p+1])).toFixed(0);
			if (old_dist != new_dist) {
				console.log("ERROR : some fixed edges has changed :", old_dist, new_dist);
				return;
			}
		}
		console.log("GOOD : every fixed edges remained unchanged")


	}

	testALL() {
		this.testGetAngle();
		this.testRotate();
		this.testIsConvex();
	}

}
