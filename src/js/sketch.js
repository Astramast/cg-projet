class CanvasUI {
	constructor() {
		this.points = [];
		this.createCanvas();
		this.createUI();
	}

	createCanvas() {
		// Create canvas and attach it to the clickable area div
		this.canvas = createCanvas(windowWidth, windowHeight);
		this.canvas.parent('clickable-area');
		textSize(20);
	}

	createUI() {
		// Buttons for user interaction
		this.backButton = new Button("Back", 40, 160, () => this.backHome());
		this.clearButton = new Button("Clear", 170, 160, () => this.resetPoints());
	}

	resetPoints() {
		this.points = [];
	}

	backHome() {
		window.location.href = 'index.html';
	}

	draw() {
		background(255);

	}

	mousePressed() {
		if (this.isWithinBounds(mouseX, mouseY)) {
			this.points.push(new Point(mouseX, mouseY));
			if (this.points.length >= 3) {
				let polygon = new ConvexPolygon(this.points);
				let tree = polygon.getFPVD();
				tree.draw();
			}
		}
	}

	isWithinBounds(x, y) {
		return (
			x >= 0 &&
			x <= width - 100 &&
			y >= 120 &&
			y <= height - 250
		);
	}

	windowResized() {
		resizeCanvas(windowWidth, windowHeight);
	}
}


let canvasUI;

function setup() {
	canvasUI = new CanvasUI();
}

function draw() {
	canvasUI.draw();
}

function mousePressed() {
	canvasUI.mousePressed();
}

function windowResized() {
	canvasUI.windowResized();
}
