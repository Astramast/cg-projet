class ConvexifyPolygonCanvasUI extends CanvasUI {
	constructor(p) {
		super(p);
		this.polygon = new Polygon();
		this.convexPolygon = null;
	}

	setup() {
		// Buttons for user interaction
		this.clearButton = new Button("Clear", this.canvasPosition.x + 10, this.canvasPosition.y, () => this.reset(), this.p);
		this.convexifyButton = new Button("Convexify", this.canvasPosition.x + 110, this.canvasPosition.y, () => this.convexify(), this.p);

		this.perimeterText = this.p.createDiv("Perimeter: " + 0);
		this.perimeterText.position(this.canvasPosition.x + 280, this.canvasPosition.y + 30);
		this.perimeterText.addClass('perimeter-text');

		this.areaText = this.p.createDiv("Area: 0");
		this.areaText.position(this.canvasPosition.x + 480, this.canvasPosition.y + 30);
		this.areaText.addClass('area-text');
	}

	reset() {
		this.polygon = new Polygon();
		this.convexPolygon = null;
		this.perimeterText.html("Perimeter: 0");
		this.areaText.html("Area: 0");
	}

	convexify() {
		if (this.convexPolygon != null) {
			this.polygon = this.convexPolygon;
		}
		this.convexPolygon = this.polygon.convexify();
		this.perimeterText.html("Perimeter: " + this.convexPolygon.perimeter().toFixed(2));
		this.areaText.html("Area: " + this.convexPolygon.area().toFixed(2));
	}

	draw() {
		// Draw background
		this.p.background("#FFF9BF");

		// Draw the drawing area
		this.p.stroke("#CB9DF0");
		this.p.fill("#CB9DF0");
		this.p.rect(0, 80, this.p.width, this.p.height);

		// Draw Convex Polygon
		if (this.convexPolygon != null) {
			this.p.stroke("#8E24AA");
			this.p.fill("#ba76f1");
			this.p.beginShape();
			for (let p of this.convexPolygon.points) {
				this.p.vertex(p.x, p.y);
			}
			this.p.endShape(this.p.CLOSE);

			this.p.stroke("#FFF9BF");
			this.p.fill("#FFF9BF");
			for (let p of this.convexPolygon.points) {
				this.p.ellipse(p.x, p.y, 6, 6);
			}
		}

		// Draw Polygon
		this.p.stroke("#FFF9BF");
		this.p.fill("#ba76f1");
		this.p.beginShape();
		for (let p of this.polygon.points) {
			this.p.vertex(p.x, p.y);
		}
		this.p.endShape(this.p.CLOSE);


		// Draw Points
		this.p.stroke("#FFF9BF");
		this.p.fill("#FFF9BF");
		for (let p of this.polygon.points) {
			this.p.ellipse(p.x, p.y, 6, 6);
		}
	}


	mousePressed() {
		if (this.p.mouseX < 0 || this.p.mouseX > this.p.width || this.p.mouseY < 80 || this.p.mouseY > this.p.height) return;
		if (this.convexPolygon != null) {
			this.polygon = new Polygon();
			this.convexPolygon = null;
			this.perimeterText.html("Perimeter: 0");
			this.areaText.html("Area: 0");
		}
		let p = new Point(this.p.mouseX, this.p.mouseY);
		if (this.polygon.points.length < 3 || this.polygon.doesNotIntersect(p)) {
			this.polygon.addPoint(p);
			this.perimeterText.html("Perimeter: " + this.polygon.perimeter().toFixed(2));
			this.areaText.html("Area: " + this.polygon.area().toFixed(2));
		}
	}


}