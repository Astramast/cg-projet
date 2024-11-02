class CanvasUI {
	constructor() {
		this.points = [];
		this.hull = [];
		this.updateBounds();  // Initialize bounds based on window size
		this.createCanvas();
		this.createUI();
	}

	createCanvas() {
		createCanvas(windowWidth, windowHeight);
		textSize(20);
	}

	createUI() {
		// Clear button to reset points
		new Button("Clear", 40, 160, () => this.resetPoints());
		// Show Convex Hull button to display the convex hull polygon
		new Button("Show Convex Hull", 40, 200, () => this.computeAndShowHull());
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
		background("#add8e6"); // Light blue background

		// Draw clickable area with a distinct background color
		noStroke();
		fill("#cce5ff");  // Light blue background for the box
		rect(this.bounds.x, this.bounds.y, this.bounds.width, this.bounds.height);

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
			x > this.bounds.x &&
			x < this.bounds.x + this.bounds.width &&
			y > this.bounds.y &&
			y < this.bounds.y + this.bounds.height
		);
	}

	// Update bounds based on current window size
	updateBounds() {
		this.bounds = {
			x: windowWidth * 0.2,
			y: windowHeight * 0.2,
			width: windowWidth * 0.6,
			height: windowHeight * 0.6
		};
	}

	// Resize canvas and update bounds when the window is resized
	windowResized() {
		resizeCanvas(windowWidth, windowHeight);
		this.updateBounds();
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
