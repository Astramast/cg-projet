class CanvasUI {
	constructor() {
		this.points = [];
		this.hull = new Polygon();
		this.closedCurve = new ClosedCurve();
		this.perimeterSlider = null; // Slider for perimeter adjustment
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

		// Slider for adjusting perimeter
		this.perimeterSlider = createSlider(0, 1000, 0);
		this.perimeterSlider.position(320, 220);
		this.perimeterSlider.addClass('slider');
		this.perimeterSlider.input(() => this.adjustPerimeter());

		// Perimeter and area text
		this.perimeterText = createDiv("Perimeter: " + this.perimeterSlider.value());
		this.perimeterText.position(330, 190);
		this.perimeterText.addClass('perimeter-text');

		this.areaText = createDiv("Area: 0");
		this.areaText.position(550, 190);
		this.areaText.addClass('area-text');
	}

	resetPoints() {
		this.points = [];
		this.hull = new Polygon();
		this.closedCurve = new ClosedCurve();
		this.perimeterSlider.attribute('min', 0);
		this.perimeterSlider.attribute('max', 1000);
		this.perimeterSlider.value(0);
		this.perimeterText.html("Perimeter: 0");
		this.areaText.html("Area: 0");
	}

	backHome() {
		window.location.href = 'index.html';
	}

	computeAndShowHull() {
		this.hull = new Polygon(computeConvexHull(Array.from(this.points)));
	}

	adjustPerimeter() {
		const desiredPerimeter = this.perimeterSlider.value();
		this.perimeterText.html("Perimeter: " + desiredPerimeter.toFixed(2));

		if (this.hull.points.length > 0) {
			this.computePQCurve(desiredPerimeter);
		}
	}

	computePQCurve(desiredPerimeter) {
		this.closedCurve = findPQCurve(this.hull, desiredPerimeter);
	}

	draw() {
		background("#FFF9BF");

		stroke("#CB9DF0");
		fill("#CB9DF0");
		rect(0, 120, width - 100, height - 250 - 120);

		stroke("#FFF9BF");
		for (let p of this.points) {
			fill("#FFF9BF");
			ellipse(p.x, p.y, 6, 6);
		}

		stroke("#00000");
		// Show closed curve if it exists
		if (this.closedCurve.points.length > 0) {
			if (this.closedCurve.points.length < 3) return;

			noFill();
			beginShape();
			// Use curveVertex for smooth curves (closed path)
			for (let i = 0; i < this.closedCurve.points.length; i++) {
				curveVertex(this.closedCurve.points[i].x, this.closedCurve.points[i].y);
			}
			// Close the shape by connecting the last point to the first one
			curveVertex(this.closedCurve.points[0].x, this.closedCurve.points[0].y);
			endShape(CLOSE);
		}

		stroke("#FFF9BF");
		if (this.hull.points.length > 0) {
			noFill();
			beginShape();
			for (let p of this.hull.points) {
				vertex(p.x, p.y);
			}
			endShape(CLOSE);

			if (this.closedCurve.points.length === 0) {
				this.areaText.html("Area: " + this.hull.area().toFixed(2));
				this.perimeterSlider.value(this.hull.perimeter());
				this.perimeterText.html("Perimeter: " + this.hull.perimeter().toFixed(2));
			} else {
				this.areaText.html("Area: " + this.closedCurve.area().toFixed(2));
				this.perimeterSlider.value(this.closedCurve.perimeter());
				this.perimeterText.html("Perimeter: " + this.closedCurve.perimeter().toFixed(2));
			}
			const currentPerimeter = this.hull.perimeter();
			this.perimeterSlider.attribute('min', currentPerimeter);
			this.perimeterSlider.attribute('max', currentPerimeter * 3);
		}
	}

	mousePressed() {
		if (this.isWithinBounds(mouseX, mouseY)) {
			this.points.push(new Point(mouseX, mouseY));
			if (this.points.length > 2) {
				this.computeAndShowHull();
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
