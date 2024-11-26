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
new p5(convexifyPolygonSketch);
new p5(cauchyArmLemmaSketch);
new p5(farthestPointVDSketch);
new p5(optimalCurveSketch);