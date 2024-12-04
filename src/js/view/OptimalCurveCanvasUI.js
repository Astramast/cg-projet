class OptimalCurveCanvasUI extends CanvasUI {
	constructor(p) {
		super(p);
		this.points = [];
		this.hull = new Polygon();
		this.pqcurve = null;
		this.perimeterSlider = null; // Slider for perimeter adjustment
	}

	setup() {
		// Buttons for user interaction
		this.clearButton = new Button("Clear", this.canvasPosition.x + 10, this.canvasPosition.y, () => this.resetPoints(), this.p);

		// Slider for adjusting perimeter
		this.perimeterSlider = this.p.createSlider(0, 1000, 0);
		this.perimeterSlider.position(this.canvasPosition.x + 120, this.canvasPosition.y + 40);
		this.perimeterSlider.addClass('slider');
		this.perimeterSlider.input(() => this.adjustPerimeter());

		// Perimeter and area text
		this.perimeterText = this.p.createDiv("Perimeter: " + this.perimeterSlider.value());
		this.perimeterText.position(this.canvasPosition.x + 350, this.canvasPosition.y + 30);
		this.perimeterText.addClass('perimeter-text');

		this.areaText = this.p.createDiv("Area: 0");
		this.areaText.position(this.canvasPosition.x + 550, this.canvasPosition.y + 30);
		this.areaText.addClass('area-text');
	}

	resetPoints() {
		this.points = [];
		this.hull = new Polygon();
		this.pqcurve = null;
		this.perimeterSlider.attribute('min', 0);
		this.perimeterSlider.attribute('max', 1000);
		this.perimeterSlider.value(0);
		this.perimeterText.html("Perimeter: 0");
		this.areaText.html("Area: 0");
	}

	adjustPerimeter() {
		const desiredPerimeter = this.perimeterSlider.value();
		this.perimeterText.html("Perimeter: " + desiredPerimeter.toFixed(2));

		if (this.hull.points.length > 0) {
			this.pqcurve = new PQCurve(this.hull).getCurve(desiredPerimeter);
		}

		let currentPerimeter;
		if (this.pqcurve == null) {
			this.areaText.html("Area: " + this.hull.area().toFixed(2));
			this.perimeterText.html("Perimeter: " + this.hull.perimeter().toFixed(2));
			currentPerimeter = this.hull.perimeter();
		} else {
			this.areaText.html("Area: " + this.pqcurve.area().toFixed(2));
			this.perimeterText.html("Perimeter: " + this.pqcurve.perimeter().toFixed(2));
			currentPerimeter = this.pqcurve.perimeter();
		}
		this.perimeterSlider.value(currentPerimeter);
		this.perimeterSlider.attribute('min', this.hull.perimeter());
		this.perimeterSlider.attribute('max', new ConvexHull(this.hull).getSmallestEnclosingCircle().perimeter() * 1.5);
	}

	draw() {
		// Draw background
		this.p.background("#FFF9BF");

		// Draw the drawing area
		this.p.stroke("#CB9DF0");
		this.p.fill("#CB9DF0");
		this.p.rect(0, 100, this.p.width, this.p.height);

		if (this.pqcurve == null) {
			// Draw convex hull
			this.p.stroke("#FFF9BF");
			this.p.fill("#ba76f1");
			this.p.beginShape();
			for (let p of this.hull.points) {
				this.p.vertex(p.x, p.y);
			}
			this.p.endShape(this.p.CLOSE);
		} else {
			// Draw PQ curve
			this.pqcurve.draw(this.p);
		}

		// Draw points
		this.p.stroke("#FFF9BF");
		this.p.fill("#FFF9BF");
		for (let p of this.points) {
			this.p.ellipse(p.x, p.y, 6, 6);
		}

	}


	mousePressed() {
		if (this.p.mouseX < 0 || this.p.mouseX > this.p.width || this.p.mouseY < 100 || this.p.mouseY > this.p.height) return;
		this.points.push(new Point(this.p.mouseX, this.p.mouseY));
		if (this.points.length > 2) {
			this.hull = new Polygon(new ConvexHull(Array.from(this.points)).points);
			this.adjustPerimeter();
		}
	}

}