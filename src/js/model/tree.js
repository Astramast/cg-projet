class Tree {
	constructor(vertices, edges) {
		this.root = null;
		this.vertices = vertices;
		this.edges = edges;
		if (vertices != null && vertices.length > 0) {
			this.root = vertices[0];
		}
	}
	draw() {
		for (v of this.vertices) {
			v.draw();
		}
		for (e of this.edges) {
			e.draw();
		}
	}
}

window.Tree = Tree

