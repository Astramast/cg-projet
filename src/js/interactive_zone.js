
const convifyPolygonSketch = (p) =>  {
	let canvasUI;
	p.setup = () => {
		canvasUI = new ConvexifyPolygonCanvasUI(p);
		let canvas = p.createCanvas(p.windowWidth/2, p.windowHeight/2);
		canvas.parent("convexify-polygon");
	}
	p.draw = () => { canvasUI.draw(); }
	p.mousePressed = () => { canvasUI.mousePressed(); }
	p.windowResized = () => { canvasUI.windowResized(); }
	// Add more p5.js functions as needed
}

new p5(convifyPolygonSketch);