class CauchyArmLemmaCanvasUI extends CanvasUI {
	constructor(p) {
		super(p);
		this.points = [];
	}

	setup() {
		// Buttons for user interaction
		this.clearButton = new Button("Clear", this.canvasPosition.x + 10, this.canvasPosition.y, () => this.resetPoints(), this.p);
	}

	resetPoints() {
		this.points = [];
	}

	draw() {
		// Draw background
		this.p.background("#FFF9BF");

		// Draw the drawing area
		this.p.stroke("#CB9DF0");
		this.p.fill("#CB9DF0");
		this.p.rect(0, 80, this.p.width, this.p.height);


		this.p.stroke("#FFF9BF");
		this.p.fill("#FFF9BF");
		for (let p of this.points) {
			this.p.ellipse(p.x, p.y, 6, 6);
		}
	}


	mousePressed() {
		if (this.p.mouseX < 0 || this.p.mouseX > this.p.width || this.p.mouseY < 80 || this.p.mouseY > this.p.height) return;
		this.points.push(new Point(this.p.mouseX, this.p.mouseY));
		console.log(this.points);
	}


	isConvex(polygon) {
		let hull = computeConvexHull(polygon);
		return polygon.length === hull.length;
	}

	getAngle(a, b, c) {  // made by copilot
		let v1 = [b.x - a.x, b.y - a.y];
		let v2 = [c.x - b.x, c.y - b.y];
		let dot = v1[0] * v2[0] + v1[1] * v2[1];
		let det = v1[0] * v2[1] - v1[1] * v2[0];
		let angle = Math.atan2(det, dot) * 180 / Math.PI;
		return angle < 0 ? angle + 360 : angle;
	}

	testGetAngle() {
		let a = new Point(0, 0);
		let b = new Point(1, 0);
		let c = new Point(1, 1);
		let result = this.getAngle(a, b, c);
		if (result !== 90) {
			console.log("ERROR : getAngle failed")
		} else {
			console.log("getAngle success")
		}
	}

	rotate(origin, p, angle) {  // made by copilot
		let radians = angle * Math.PI / 180;
		let cos = Math.cos(radians);
		let sin = Math.sin(radians);
		let x = cos * (p.x - origin.x) - sin * (p.y - origin.y) + origin.x;
		let y = sin * (p.x - origin.x) + cos * (p.y - origin.y) + origin.y;
		return new Point(x, y);
	}

	testRotate() {
		let origin = new Point(0, 0);
		let p = new Point(1, 0);
		let angle = 90;
		let result = this.rotate(origin, p, angle);
		if (result.x !== 0 || result.y !== 1) {
			console.log("ERROR : rotate failed")
		} else {
			console.log("rotate success")
		}
	}

	propagateStretch(c, polygon, angle) {
		let n = polygon.length;
		for (let p = c; p !== n-1; p++) {
			let p0 = p - 1;
			polygon[p] = this.rotate(polygon[p0], polygon[p], angle);
		}
	}

	stretchPolygon(polygon, a) {
		// stretch polygon at angle a-b-c and propagate the stretch
		if (!this.isConvex(polygon)) {
			console.log("ERROR : polygon not convex, no stretching possible")
			return;
		}

		let n = polygon.length;
		let b = (a + 1) % n;
		let c = (b + 1) % n;
		while (c !== 0) {
			let phy = this.getAngle(polygon[a], polygon[b], polygon[c]);
			let diff = 180 - phy;
			if (diff > 0) {
				let new_phy = phy + (diff / 2);
				this.propagateStretch(a, b, c, polygon, new_phy);
			} else {
				console.log("ERROR : polygon not convex, no stretching possible")
				break;
			}
		}
	}

	chooseStretch(polygon, nbAngleToStretch) {
		// the user choose a nb x and we choose x angle to stretch
		let n = polygon.length;
		let angleToStretch = [];
		for (let i = 0; i < nbAngleToStretch; i++) {  // we push random values between 0 and n-2, n and n-1 are exluded
			angleToStretch.push(Math.floor(Math.random() * (n - 1)));  // made by copilot
		}

		for (let a = 0; a < nbAngleToStretch; a++) {
			this.stretchPolygon(polygon, angleToStretch[a]);
		}
	}
}
