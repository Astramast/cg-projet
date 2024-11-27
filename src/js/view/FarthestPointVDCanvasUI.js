class FarthestPointVDCanvasUI extends CanvasUI {
	constructor(p) {
		super(p);
		this.points = [];
		this.fvpd = null;
	}

	setup() {
		this.clearButton = new Button("Clear", this.canvasPosition.x + 10, this.canvasPosition.y, () => this.resetPoints(), this.p);
	}

	resetPoints() {
		this.points = [];
		this.fvpd = null;
	}

	draw() {
		// Draw background
		this.p.background("#FFF9BF");

		// Draw the drawing area
		this.p.stroke("#CB9DF0");
		this.p.fill("#CB9DF0");
		this.p.rect(0, 80, this.p.width, this.p.height);

		this.p.stroke("#FFF9BF");
		this.p.fill("#FFF9BF");
		for (let p of this.points) {
			this.p.ellipse(p.x, p.y, 6, 6);
		}

		if (this.fvpd != null) {
			this.fvpd.draw(this.p);
		}
	}


	mousePressed() {
		if (this.p.mouseX < 0 || this.p.mouseX > this.p.width || this.p.mouseY < 80 || this.p.mouseY > this.p.height) return;
		this.points.push(new Point(this.p.mouseX, this.p.mouseY));
		this.fvpd = FarthestPointVoronoiDiagram.fromPoints(this.points);
	}

}
