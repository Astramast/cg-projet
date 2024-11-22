// Interface for all canvas UI elements
class CanvasUI {

	constructor(p) {
		this.p = p;
	}


	draw() {
		throw new Error("Method 'draw()' must be implemented.");
	}

	mousePressed() {
		throw new Error("Method 'mousePressed()' must be implemented.");
	}

	windowResized() {
		throw new Error("Method 'windowResized()' must be implemented.");
	}
}