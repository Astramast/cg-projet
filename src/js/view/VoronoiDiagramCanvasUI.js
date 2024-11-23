class VoronoiDiagramCanvasUI extends CanvasUI {
	constructor(p) {
		super(p);
		this.points = [];
		this.voronoiDiagram = null;
	}

	setup() {

	}

	draw() {
		this.p.background("#CB9DF0");

		if (this.voronoiDiagram != null) {
			this.voronoiDiagram.draw(this.p);
		}

		this.p.stroke(0);
		this.p.fill(0);
		for (let p of this.points) {
			this.p.ellipse(p.x, p.y, 6, 6);
		}
	}


	mousePressed() {
		if (this.p.mouseX < 0 || this.p.mouseX > this.p.width || this.p.mouseY < 0 || this.p.mouseY > this.p.height) return;
		this.points.push(new Point(this.p.mouseX, this.p.mouseY));
		if (this.points.length >= 2) {
			let convexPolygon = new ConvexPolygon(this.points);
			this.voronoiDiagram = convexPolygon.getFPVD();
		}
	}


}