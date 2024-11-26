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
			this.p.fill("#ba76f1");
			this.p.beginShape();
			for (let p of this.polygonStretched) {
				this.p.vertex(p.x, p.y);
			}
			this.p.endShape(this.p.CLOSE);
		}

		// drawing lines
		this.p.stroke("#8E24AA");
		this.p.fill("#ba76f1");
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

	getAngle(a, b, c) {  // shit by copilot
		let v1 = [b.x - a.x, b.y - a.y];
		let v2 = [c.x - b.x, c.y - b.y];
		let dot = v1[0] * v2[0] + v1[1] * v2[1];
		let det = v1[0] * v2[1] - v1[1] * v2[0];
		let angle = Math.atan2(det, dot) * 180 / Math.PI;
		angle = angle < 0 ? angle + 360 : angle;
		return angle > 180 ? 360 - angle : angle;
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

	rotate(origin, p, angle) {  // shit by copilot
		// need to choose clockwise or couterclkws rotation
		let radians = angle * Math.PI / 180;
		let cos = Math.cos(radians);
		let sin = Math.sin(radians);
		// let x = Math.round((cos * (p.x - origin.x) - sin * (p.y - origin.y) + origin.x) * 1e10) / 1e10;
		let x = (cos * (p.x - origin.x) - sin * (p.y - origin.y) + origin.x).toFixed(10);
		let y = (sin * (p.x - origin.x) + cos * (p.y - origin.y) + origin.y).toFixed(10);
		return new Point(x, y);
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

	propagateStretch(c, polygon, angle) {
		let n = polygon.length;
		let p = c;
		console.log("propagateStretch", c, p, angle);
		while (p < n && p != 0) {
			let p0 = (p - 1 + n) % n;
			polygon[p] = this.rotate(polygon[p0], polygon[p], angle);
			console.log("propagateStretch", c, p, angle);
			p = (p + 1) % n;
		}
	}

	stretchPolygon(polygon, a) {
		// stretch polygon at angle a-b-c and propagate the stretch
		// a is an index
		if (!this.isConvex(polygon)) {
			console.log("ERROR : isConvex failed");
			return;
		}

		let n = polygon.length;
		let b = (a + 1) % n;
		let c = (b + 1) % n;
		while (c != 0) {
			
			let theta = this.getAngle(polygon[a], polygon[b], polygon[c]);
			let diff = 180 - theta;
			if (diff > 0) {
				let new_theta = (theta + (diff / 2)) % 180;
				console.log("stretchPolygon", a, b, c, polygon, theta, diff, new_theta);
				this.propagateStretch(c, polygon, new_theta);
				console.log("new angle abc :", this.getAngle(polygon[a], polygon[b], polygon[c]));
			} else {
				console.log("ERROR : polygon not convex, angle diff null or negative :", diff, theta, a, b, c)
				break;
			}

			b = (b + 1) % n;
			c = (c + 1) % n;
			
		}
	}

	chooseStretch(polygon) {
		// the user choose a nb x and we choose x angle to stretch
		let n = polygon.length;
		// let angleToStretch = [0];
		let angleToStretch = [];
		for (let i = 0; i < this.nbAngleToStretch; i++) {  // we push random values between 0 and n-2, n and n-1 are exluded
			angleToStretch.push(Math.floor(Math.random() * (n - 1)));  // made by copilot
		}

		for (let a = 0; a < this.nbAngleToStretch; a++) {
			this.stretchPolygon(polygon, angleToStretch[a]);
		}
	}

	test() {
		this.testGetAngle();
		this.testRotate();
		this.testIsConvex();
	}

	Stretch() {
		// this.test();
		// this.chooseStretch(this.points);
		this.polygonStretched = [...this.points]
		this.stretchPolygon(this.polygonStretched, 0)
		// this.isConvex(this.points);
	}

}
