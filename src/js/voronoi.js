class CanvasUI {
	constructor() {
		this.points = [];
		this.hull = null; 
		this.fvpd = null;
		this.createCanvas();
		this.createUI();
	}
	createCanvas() {
		// Create canvas and attach it to the clickable area div
		this.canvas = createCanvas(windowWidth, windowHeight);
		this.canvas.parent('clickable-area');
		textSize(20);
	}

	createUI() {
		// Buttons for user interaction
		this.backButton = new Button("Back", 40, 160, () => this.backHome());
		this.clearButton = new Button("Clear", 170, 160, () => this.reset());
	}

	reset() {
		this.points = [];
		this.fvpd = null;
	}

	backHome() {
		window.location.href = 'index.html';
	}

	computeFVPD() {
		this.fvpd = new VoronoiDiagram(this.points[0], this.points[1], this.points[2]);
	}

	draw() {
		background("#FFF9BF");

		stroke("#CB9DF0");
		fill("#CB9DF0");
		rect(0, 120, width - 100, height - 250 - 120);

		stroke("#FFF9BF");
		if (this.hull != null) {
			this.hull.draw();
		}
		if (this.fvpd != null) {
			this.fvpd.draw();
			return;
		}
		stroke("#FFF9BF");
		for (let p of this.points) {
			fill("#FFF9BF");
			ellipse(p.x, p.y, 6, 6);
		}

	}

	mousePressed() {
		if (this.isWithinBounds(mouseX, mouseY)) {
			if (this.points.length == 3) {
				this.reset();
			}
			this.points.push(new Point(mouseX, mouseY));
			if (this.points.length == 3) {
				this.computeFVPD();
			}
		}
	}

	isWithinBounds(x, y) {
		return (
			x >= 0 &&
			x <= width - 100 &&
			y >= 120 &&
			y <= height - 250
		);
	}

	windowResized() {
		resizeCanvas(windowWidth, windowHeight);
	}
}

let canvasUI;

function setup() {
	canvasUI = new CanvasUI();
}

function draw() {
	canvasUI.draw();
}

function mousePressed() {
	canvasUI.mousePressed();
}

function windowResized() {
	canvasUI.windowResized();
}
