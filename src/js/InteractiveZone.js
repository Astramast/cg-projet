const convexifyPolygonSketch = (p) => {
	let canvasUI;
	p.setup = () => {
		canvasUI = new ConvexifyPolygonCanvasUI(p);
		let canvas = p.createCanvas(3 * p.windowWidth / 4, p.windowHeight / 2);
		canvas.parent("convexify-polygon");
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


const voronoiDiagramSketch = (p) => {
	let canvasUI;
	p.setup = () => {
		canvasUI = new VoronoiDiagramCanvasUI(p);
		let canvas = p.createCanvas(3 * p.windowWidth / 4, p.windowHeight / 2);
		canvas.parent("voronoi-diagram");
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
		let canvas = p.createCanvas(3 * p.windowWidth / 4, p.windowHeight / 2);
		canvas.parent("optimal-curve");
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


new p5(convexifyPolygonSketch);
new p5(voronoiDiagramSketch);
new p5(optimalCurveSketch);