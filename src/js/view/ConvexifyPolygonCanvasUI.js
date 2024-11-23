class ConvexifyPolygonCanvasUI extends CanvasUI {
	constructor(p) {
		super(p);
		this.polygon = new Polygon();
	}

	setup() {
		// Buttons for user interaction
		this.clearButton = new Button("Clear", this.canvasPosition.x + 10, this.canvasPosition.y, () => this.reset(), this.p);
		this.convexifyButton = new Button("Convexify", this.canvasPosition.x + 200, this.canvasPosition.y, () => this.convexify(), this.p);
	}

	reset() {
		this.polygon = new Polygon();
	}

	convexify() {
		this.polygon.convexify();
	}

	draw() {
		// Draw background
		this.p.background("#FFF9BF");

		// Draw the drawing area
		this.p.stroke("#CB9DF0");
		this.p.fill("#CB9DF0");
		this.p.rect(0, 100, this.p.width, this.p.height);

		// Draw points
		this.p.stroke("#FFF9BF");
		this.p.beginShape();
		for (let p of this.polygon.points) {
			this.p.fill("#FFF9BF");
			this.p.ellipse(p.x, p.y, 6, 6);
			this.p.noFill();
			this.p.vertex(p.x, p.y);
		}
		this.p.endShape(this.p.CLOSE);
	}


	mousePressed() {
		if (this.p.mouseX < 0 || this.p.mouseX > this.p.width || this.p.mouseY < 100 || this.p.mouseY > this.p.height) return;
		let p = new Point(this.p.mouseX, this.p.mouseY);
		if (this.polygon.points.length < 3 || this.polygon.doesNotIntersect(p)) {
			this.polygon.addPoint(p);
		}
	}


}