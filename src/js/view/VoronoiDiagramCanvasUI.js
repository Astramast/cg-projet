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

		this.p.stroke("#fff8ba");
		this.p.fill("#fff8ba");

		if (this.voronoiDiagram != null) {
			this.voronoiDiagram.draw(this.p);
		}

		for (let p of this.points) {
			this.p.ellipse(p.x, p.y, 6, 6);
		}
	}


	mousePressed() {
		if (this.p.mouseX < 0 || this.p.mouseX > this.p.width || this.p.mouseY < 0 || this.p.mouseY > this.p.height) return;
		this.points.push(new Point(this.p.mouseX, this.p.mouseY));
		if (this.points.length >= 2) {
			let bounds = [new Point(-this.p.width, -this.p.height), new Point(this.p.width, -this.p.height), new Point(this.p.width, this.p.height), new Point(-this.p.width, this.p.height)];
			this.voronoiDiagram = VoronoiDiagram.fromPoints(this.points, bounds);
		}
	}


}