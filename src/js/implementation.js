class Point {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
}

class Button {
	constructor(label, x, y, callback) {
		this.button = createButton(label);
		this.button.position(x, y);
		this.button.mousePressed(callback);
	}
}

class CanvasUI {
	constructor() {
		this.points = [];
		this.createCanvas();
		this.createUI();
	}

	createCanvas() {
		createCanvas(windowWidth, windowHeight);
		textSize(40);
	}

	createUI() {
		new Button("Clear", 40, 160, () => this.resetPoints());
		// new Button("Done", 90, 80, () => this.computeConvexHull());
	}

	resetPoints() {
		this.points = [];
	}

	draw() {
		background("#add8e6");
		// Draw points
		stroke("yellow");
		fill("yellow");
		for (let p of this.points) {
			ellipse(p.x, p.y, 6, 6);
		}
	}

	mousePressed() {
		this.points.push(new Point(mouseX, mouseY));
	}
}

// Global instance of CanvasUI
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
	resizeCanvas(windowWidth, windowHeight);
}
