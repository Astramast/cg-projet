class CanvasUI {
	constructor() {
		this.points = [];
		this.hull = [];
		this.createCanvas();
		this.createUI();
	}

	createCanvas() {
		// Create canvas and attach it to the clickable area div
		this.canvas = createCanvas(windowWidth, windowHeight);
		this.canvas.parent('clickable-area'); // Attach the canvas to the clickable area div
		textSize(20);
	}

	createUI() {
		// Clear button to reset points
		this.clearButton = new Button("Clear", 40, 160, () => this.resetPoints());
		// Show Convex Hull button to display the convex hull polygon
		this.hullButton = new Button("Show Convex Hull", 170, 160, () => this.computeAndShowHull());
	}

	resetPoints() {
		this.points = [];
		this.hull = [];
	}

	computeAndShowHull() {
		// Compute the convex hull and store it
		this.hull = computeConvexHull(this.points);
	}

	draw() {
		background(0);

		// Draw points
		stroke("yellow");
		fill("yellow");
		for (let p of this.points) {
			ellipse(p.x, p.y, 6, 6);
		}

		// Draw convex hull as a polygon if it exists
		if (this.hull.length > 0) {
			stroke("red");
			noFill();
			beginShape();
			for (let p of this.hull) {
				vertex(p.x, p.y);
			}
			endShape(CLOSE);
		}
	}

	mousePressed() {
		// Only add point if within the specified bounds
		if (this.isWithinBounds(mouseX, mouseY)) {
			this.points.push(new Point(mouseX, mouseY));
		}
	}

	// Check if a point is within the defined bounds
	isWithinBounds(x, y) {
		return (
			x >= 0 &&
			x <= width &&
			y >= 0 &&
			y <= height
		);
	}

	// Resize canvas and update bounds when the window is resized
	windowResized() {
		resizeCanvas(windowWidth, windowHeight);
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
	canvasUI.windowResized();
}
