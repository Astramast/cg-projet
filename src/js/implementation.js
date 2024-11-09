class CanvasUI {
	constructor() {
		this.points = [];
		this.hull = new Polygon();
		this.perimeterSlider = null; // Slider for perimeter adjustment
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
		// Buttons for user interaction
		this.backButton = new Button("Back", 40, 160, () => this.backHome());
		this.clearButton = new Button("Clear", 170, 160, () => this.resetPoints());

		// Slider for adjusting perimeter
		this.perimeterSlider = createSlider(100, 1000, 300); // Min: 100, Max: 1000, Initial: 300
		this.perimeterSlider.position(300, 160); // Position the slider at the same height as the buttons
		this.perimeterSlider.style('width', '200px');
		this.perimeterSlider.style('background', '#FF6F61'); // Set the background color of the slider
		this.perimeterSlider.style('height', '8px'); // Slider height
		this.perimeterSlider.input(() => this.adjustPerimeter());

		// Styling and positioning for perimeter and area text
		this.perimeterText = createDiv("Perimeter: " + this.perimeterSlider.value());
		this.perimeterText.position(300, 130); // Position above the slider at the same height as buttons
		this.perimeterText.style('color', '#FF6F61');
		this.perimeterText.style('font-size', '18px');
		this.perimeterText.style('font-weight', 'bold');

		this.areaText = createDiv("Area: 0");
		this.areaText.position(520, 130); // Position near the perimeter text at the same height
		this.areaText.style('color', '#4CAF50');
		this.areaText.style('font-size', '18px');
		this.areaText.style('font-weight', 'bold');
	}

	resetPoints() {
		this.points = [];
		this.hull = new Polygon();
		this.perimeterSlider.value(300); // Reset the slider to initial value
		this.perimeterText.html("Perimeter: " + this.perimeterSlider.value()); // Reset perimeter text
		this.areaText.html("Area: 0"); // Reset area text
	}

	backHome() {
		window.location.href = 'index.html';
	}

	computeAndShowHull() {
		// Compute the convex hull and store it
		this.hull = new Polygon(computeConvexHull(Array.from(this.points)));
	}

	adjustPerimeter() {
		// Adjust the convex hull based on the perimeter slider value
		const desiredPerimeter = this.perimeterSlider.value();
		this.perimeterText.html("Perimeter: " + desiredPerimeter.toFixed(2));

		if (this.hull.points.length > 0) {
			// Adjust the hull's perimeter (dummy function here, adjust as per your implementation)
			this.hull.adjustToPerimeter(desiredPerimeter);
		}
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

			// Update area text dynamically
			this.areaText.html("Area: " + this.hull.area().toFixed(2));

			// Update perimeter slider and text once the hull is computed
			this.perimeterSlider.value(this.hull.perimeter()); // Set the slider to match the perimeter of the hull
			this.perimeterText.html("Perimeter: " + this.hull.perimeter().toFixed(2)); // Update perimeter text

			// Set the slider's max value to a multiple of the perimeter (e.g., 2x or 3x)
			const currentPerimeter = this.hull.perimeter();
			this.perimeterSlider.attribute('min', currentPerimeter);
			this.perimeterSlider.attribute('max', currentPerimeter * 3); // Allow scaling up to 3x the current perimeter
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
