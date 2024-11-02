class Button {
	constructor(label, x, y, callback) {
		this.button = createButton(label);
		this.button.position(x, y);
		this.button.mousePressed(callback);
		this.button.class('styled-button'); // Apply external CSS class
	}
}


window.Button = Button;