const voronoiDiagramSketch = (p) => {
	let canvasUI;
	p.setup = () => {
		canvasUI = new VoronoiDiagramCanvasUI(p);
		let size = canvasUI.getCanvasSize(p.windowWidth, p.windowHeight);
		let canvas = p.createCanvas(size.width, size.height);
		canvas.parent("voronoi-diagram");
		canvasUI.setCanvasPosition(canvas.position());
		canvasUI.setup();
	}
	p.draw = () => {
		canvasUI.draw();
	}
	p.mousePressed = () => {
		canvasUI.mousePressed();
	}
	p.windowResized = () => {
		canvasUI.windowResized();
	}
	// Add more p5.js functions as needed
}


const cauchyArmLemmaSketch = (p) => {
	let canvasUI;
	p.setup = () => {
		canvasUI = new CauchyArmLemmaCanvasUI(p);
		let size = canvasUI.getCanvasSize(p.windowWidth, p.windowHeight);
		let canvas = p.createCanvas(size.width, size.height);
		canvas.parent("cauchy-arm-lemma");
		canvasUI.setCanvasPosition(canvas.position());
		canvasUI.setup();
	}
	p.draw = () => {
		canvasUI.draw();
	}
	p.mousePressed = () => {
		canvasUI.mousePressed();
	}
	p.windowResized = () => {
		canvasUI.windowResized();
	}
	// Add more p5.js functions as needed

	function isConvex(polygon) {
		let hull = computeConvexHull(polygon);
		return polygon.length == hull.length;
	}

	function getAngle(a, b, c) {  // made by copilot
		let v1 = [b.x - a.x, b.y - a.y];
		let v2 = [c.x - b.x, c.y - b.y];
		let dot = v1[0] * v2[0] + v1[1] * v2[1];
		let det = v1[0] * v2[1] - v1[1] * v2[0];
		let angle = Math.atan2(det, dot) * 180 / Math.PI;
		return angle < 0 ? angle + 360 : angle;
	}

	function testGetAngle() {
		let a = new Point(0, 0);
		let b = new Point(1, 0);
		let c = new Point(1, 1);
		let result = getAngle(a, b, c);
		if (result != 90) {
			console.log("ERROR : getAngle failed")
		} else {
			console.log("getAngle success")
		}
	}

	function rotate(origin, p, angle) {  // made by copilot
		let radians = angle * Math.PI / 180;
		let cos = Math.cos(radians);
		let sin = Math.sin(radians);
		let x = cos * (p.x - origin.x) - sin * (p.y - origin.y) + origin.x;
		let y = sin * (p.x - origin.x) + cos * (p.y - origin.y) + origin.y;
		return new Point(x, y);
	}

	function testRotate() {
		let origin = new Point(0, 0);
		let p = new Point(1, 0);
		let angle = 90;
		let result = rotate(origin, p, angle);
		if (result.x != 0 || result.y != 1) {
			console.log("ERROR : rotate failed")
		} else {
			console.log("rotate success")
		}

	function propagateStretch(c, polygon, angle) {
		let n = polygon.length;
		for (let p = c; p != n-1; p++) {
			let p0 = p - 1;
			polygon[p] = rotate(polygon[p0], polygon[p], angle);
		}
	}

	function stretchPolygon(polygon, a) {  
		// stretch polygon at angle a-b-c and propagate the stretch
		if (!isConvex(polygon)) {
			console.log("ERROR : polygon not convex, no stretching possible")
			return;
		}

		let n = polygon.length;
		let b = (a + 1) % n;
		let c = (b + 1) % n;
		while (c != 0) {
			let phy = getAngle(polygon[a], polygon[b], polygon[c]);
			let diff = 180 - phy;
			if (diff > 0) {
				let new_phy = phy + (diff / 2);
				propagateStretch(a, b, c, polygon, new_phy);
			} else {
				console.log("ERROR : polygon not convex, no stretching possible")
				break;
			}
		}
	}

	function chooseStretch(polygon, nbAngleToStretch) {
		// the user choose a nb x and we choose x angle to stretch
		let n = polygon.length;
		let angleToStretch = [];
		for (let i = 0; i < nbAngleToStretch; i++) {  // we push random values between 0 and n-2, n and n-1 are exluded
			angleToStretch.push(Math.floor(Math.random() * (n - 1)));  // made by copilot
		}

		for (let a = 0; a < nbAngleToStretch; a++) {
			stretchPolygon(polygon, angleToStretch[a]);
		}
	}
}


const convexifyPolygonSketch = (p) => {
	let canvasUI;
	p.setup = () => {
		canvasUI = new ConvexifyPolygonCanvasUI(p);
		let size = canvasUI.getCanvasSize(p.windowWidth, p.windowHeight);
		let canvas = p.createCanvas(size.width, size.height);
		canvas.parent("convexify-polygon");
		canvasUI.setCanvasPosition(canvas.position());
		canvasUI.setup();
	}
	p.draw = () => {
		canvasUI.draw();
	}
	p.mousePressed = () => {
		canvasUI.mousePressed();
	}
	p.windowResized = () => {
		canvasUI.windowResized();
	}
	// Add more p5.js functions as needed
}

const farthestPointVDSketch = (p) => {
	let canvasUI;
	p.setup = () => {
		canvasUI = new FarthestPointVDCanvasUI(p);
		let size = canvasUI.getCanvasSize(p.windowWidth, p.windowHeight);
		let canvas = p.createCanvas(size.width, size.height);
		canvas.parent("fp-voronoi-diagram");
		canvasUI.setCanvasPosition(canvas.position());
		canvasUI.setup();
	}
	p.draw = () => {
		canvasUI.draw();
	}
	p.mousePressed = () => {
		canvasUI.mousePressed();
	}
	p.windowResized = () => {
		canvasUI.windowResized();
	}
	// Add more p5.js functions as needed
}


const optimalCurveSketch = (p) => {
	let canvasUI;
	p.setup = () => {
		canvasUI = new OptimalCurveCanvasUI(p);
		let size = canvasUI.getCanvasSize(p.windowWidth, p.windowHeight);
		let canvas = p.createCanvas(size.width, size.height);
		canvas.parent("optimal-curve");
		canvasUI.setCanvasPosition(canvas.position());
		canvasUI.setup();
	}
	p.draw = () => {
		canvasUI.draw();
	}
	p.mousePressed = () => {
		canvasUI.mousePressed();
	}
	p.windowResized = () => {
		canvasUI.windowResized();
	}
	// Add more p5.js functions as needed
}


new p5(voronoiDiagramSketch);
new p5(cauchyArmLemmaSketch);
new p5(convexifyPolygonSketch);
new p5(farthestPointVDSketch);
new p5(optimalCurveSketch);