// Interface for all canvas UI elements
class CanvasUI {

	constructor(p) {
		this.p = p;
	}

	setup() {
		throw new Error("Method 'setup()' must be implemented.");
	}

	draw() {
		throw new Error("Method 'draw()' must be implemented.");
	}

	mousePressed() {
		throw new Error("Method 'mousePressed()' must be implemented.");
	}

	windowResized() {
		let newSize = this.getCanvasSize(this.p.windowWidth, this.p.windowHeight);
		this.p.resizeCanvas(newSize.width, newSize.height);
	}

	getCanvasSize(windowWidth, windowHeight) {
		return {width: Math.min(9 * windowWidth / 10, 800), height: 2 * windowHeight / 3};
	}

	setCanvasPosition(position) {
		this.canvasPosition = position;
	}
}