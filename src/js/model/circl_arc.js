class CircleArc {
	constructor(start, end, radius) {
		this.start = start;
		this.end = end;
		this.radius = radius;
	}

	// Approximate the arc by a series of points for rendering
	getPoints(steps = 20) {
		const points = [];
		const angleStep = Math.PI / steps;

		for (let i = 0; i <= steps; i++) {
			const t = i / steps;
			const x = (1 - t) * this.start.x + t * this.end.x;
			const y = (1 - t) * this.start.y + t * this.end.y;
			points.push(new Point(x, y));
		}

		return points;
	}

	// Draw the arc using p5.js
	draw() {
		const points = this.getPoints();
		beginShape();
		for (let p of points) {
			vertex(p.x, p.y);
		}
		endShape();
	}
}

window.CircleArc = CircleArc;