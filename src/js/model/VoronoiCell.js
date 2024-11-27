class VoronoiCell {
	constructor(semilines, segments) {
		this.cell = [];
		if (semilines[0].b.getOrientationDeterminantSign(semilines[1].a, semilines[1].b) > 0) {
			this.cell.push(semilines[1]);
			this.cell.push(semilines[0]);
		} else {
			this.cell.push(semilines[0]);
			this.cell.push(semilines[1]);
		}
		let chosen = this.cell[1];
		while (segments.length > 0) {
			for (let s of segments) {
				if (s.a.isEqual(chosen.a) || s.a.isEqual(chosen.b) || s.b.isEqual(chosen.a) || s.b.isEqual(chosen.b)) {
					this.cell.push(s);
					segments.splice(segments.indexOf(s), 1);
					chosen = s;
					break;
				}
			}
		}
		this.cell.push(this.cell.shift());
	}

	isPointStrictlyInside(p) {
		let isInside = true;
		let a = this.cell[0].b;
		let b = this.cell[0].a;
		let i = 0;
		while (isInside && i < this.cell.length) {
			isInside = a.getOrientationDeterminantSign(b, p) > 0;
			a = b;
			if (i + 1 < this.cell.length) {
				if (this.cell[i + 1].a.isEqual(a)) {
					b = this.cell[i + 1].b;
				} else {
					b = this.cell[i + 1].a;
				}
			}
			i++;
		}
		return isInside;
	}
}