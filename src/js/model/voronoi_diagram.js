class VoronoiDiagram {
	constructor(points, lines) {
		this.points = points;
		this.lines = lines;
	}

	draw() {
		for (p of this.points){
			p.draw();
		}
		for (l of this.lines){
			l.draw();
		}
	}
}

window.VoronoiDiagram = VoronoiDiagram;
