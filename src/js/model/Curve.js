class Curve {
	constructor(point1, point2, radius) {
		this.point1 = point1;
		this.point2 = point2;
		this.radius = radius; // Radius of the arc
		this._computeArcProperties(); // Precompute arc properties
	}

	_computeArcProperties() {
		// Compute distance between the two points
		const dx = this.point2.x - this.point1.x;
		const dy = this.point2.y - this.point1.y;
		this.chordLength = Math.sqrt(dx * dx + dy * dy);

		// Compute the angle subtended by the arc (in radians)
		this.angle = 2 * Math.asin(this.chordLength / (2 * this.radius));
	}

	perimeter() {
		// Perimeter is the arc length: r * θ
		return this.radius * this.angle;
	}

	area() {
		// Area of the circular segment: A = 0.5 * r^2 * (θ - sin(θ))
		return 0.5 * this.radius * this.radius * (this.angle - Math.sin(this.angle));
	}

	draw(p) {
		// Compute the center of the arc
		const midX = (this.point1.x + this.point2.x) / 2;
		const midY = (this.point1.y + this.point2.y) / 2;

		// Vector from point1 to point2
		const dx = this.point2.x - this.point1.x;
		const dy = this.point2.y - this.point1.y;
		const dist = Math.sqrt(dx * dx + dy * dy);

		// Compute the height of the arc from the line connecting point1 and point2
		const h = Math.sqrt(this.radius * this.radius - (dist / 2) * (dist / 2));

		// Direction vector perpendicular to the line connecting point1 and point2
		const perpX = -dy / dist;
		const perpY = dx / dist;

		// Compute the center of the arc
		const cx = midX + h * perpX;
		const cy = midY + h * perpY;

		// Compute angles for the arc
		const angle1 = Math.atan2(this.point1.y - cy, this.point1.x - cx);
		const angle2 = Math.atan2(this.point2.y - cy, this.point2.x - cx);

		// Normalize the angles to ensure the arc is drawn correctly
		const startAngle = Math.min(angle1, angle2);
		const endAngle = Math.max(angle1, angle2);

		// Draw the arc
		p.noFill();
		p.arc(cx, cy, 2 * this.radius, 2 * this.radius, startAngle, endAngle);
	}
}