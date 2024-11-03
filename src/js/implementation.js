class CanvasUI {
	constructor() {
		this.polygon = new Polygon();
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
		// Clear button to reset points
		this.clearButton = new Button("Clear", 40, 160, () => this.resetPoints());
		// Show Convex Hull button to display the convex hull polygon
		this.hullButton = new Button("Show Convex Hull", 170, 160, () => this.computeAndShowHull());
	}

	resetPoints() {
		this.polygon = new Polygon();
		this.hull = new Polygon();
	}

	computeAndShowHull() {
		// Compute the convex hull and store it
		this.hull = new Polygon(computeConvexHull(Array.from(this.polygon.points)));
	}

	draw() {

		// Clear the canvas
		stroke("#CB9DF0");
		fill("#CB9DF0");
		rect(0, 120, width - 100, height - 250 - 120);

		// Draw points
		stroke("yellow");
		beginShape();
		for (let p of this.polygon.points) {
			fill("yellow");
			ellipse(p.x, p.y, 6, 6);
			noFill();
			vertex(p.x, p.y);
		}
		endShape(CLOSE);

		// Draw convex hull as a polygon if it exists
		if (this.hull.points.length > 0) {
			stroke("red");
			noFill();
			beginShape();
			for (let p of this.hull.points) {
				vertex(p.x, p.y);
			}
			endShape(CLOSE);
		}
	}

	mousePressed() {
		// Only add point if within the specified bounds
		let p = new Point(mouseX, mouseY);
		if (this.isWithinBounds(mouseX, mouseY) && this.polygon.doesNotIntersect(p)) {
			this.polygon.addPoint(p);
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
