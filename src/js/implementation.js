class CanvasUI {
	constructor() {
		this.points = [];
		this.hull = new Polygon();
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
		this.backButton = new Button("Back", 40, 160, () => this.backHome());
		this.clearButton = new Button("Clear", 170, 160, () => this.resetPoints());
	}

	resetPoints() {
		this.points = [];
		this.hull = new Polygon();
	}

	backHome() {
		window.location.href = 'index.html';
	}

	computeAndShowHull() {
		// Compute the convex hull and store it
		this.hull = new Polygon(computeConvexHull(Array.from(this.points)));
	}

	draw() {
		background("#FFF9BF");

		// Clear the canvas
		stroke("#CB9DF0");
		fill("#CB9DF0");
		rect(0, 120, width - 100, height - 250 - 120);

		// Draw points
		stroke("#FFF9BF");
		for (let p of this.points) {
			fill("#FFF9BF");
			ellipse(p.x, p.y, 6, 6);
		}

		// Draw convex hull as a polygon if it exists
		if (this.hull.points.length > 0) {
			noFill();
			beginShape();
			for (let p of this.hull.points) {
				vertex(p.x, p.y);
			}
			endShape(CLOSE);

			// Draw perimeter of the convex hull
			stroke("#FF6F61");
			fill("#FF6F61");
			textSize(20);
			text("Perimeter: " + this.hull.perimeter().toFixed(2), width - 200, height - 200);
		}
	}

	mousePressed() {
		// Only add point if within the specified bounds
		if (this.isWithinBounds(mouseX, mouseY)) {
			this.points.push(new Point(mouseX, mouseY));
			if (this.points.length > 2) {
				this.computeAndShowHull();
			}
		}
	}

	// Check if a point is within the defined bounds
	isWithinBounds(x, y) {
		return (
			x >= 0 &&
			x <= width - 100 &&
			y >= 120 &&
			y <= height - 250
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
