
/*Events*/

// SAVE TO FILE
__('#save').on('click', function () {
	saveFile();
});

__("#upload").on('click', function () {
	//smá mix til að nota custom button, eflaust hægt gera þetta á annan mána.
	let btn = document.getElementById('myFile');
	if (btn && document.createEvent) {
		let evt = document.createEvent("MouseEvents");
		evt.initEvent("click", true, false);
		btn.dispatchEvent(evt);
	}
});

// UPLOAD FILE EVENT
__("#myFile").on('change', function () {
	loadFile();
});

// DOWNLOAD FILE
__('#getImg').on('click', function () {
	downLoadImg()
});

// CLEAR CANVAS
__('#clear').onClick(function () {
	clearCanvas();
	drawio.shapes = [];
});

//SELECT TOOL
__('.type input').on("change", function () {
	drawio.selectedTool = this.id;
	if (drawio.selectedTool !== 'text') {
		hideTextBox()
	}
});

__('#stroke-color').on("change", function () {
	drawio.strokeColor = this.value;
	drawio.ctx.strokeStyle = this.value;
});

__('#stroke-size').on('change', function () {

	drawio.strokeSize = this.value;
	drawio.ctx.lineWidth = this.value;
	__("#lineWidthText").insertText(this.value);
});

__('#fill-color').on('change', function () {
	drawio.fillColor = this.value;
	drawio.ctx.fillStyle = this.value;
});

__('#filled').on('change', function () {
	drawio.fill = !drawio.fill;
});

__('#outline').on('change', function () {
	drawio.stroke = !drawio.stroke;
});

__('#undo').on('click', function () {
	if (drawio.shapes.length === 0) return;
	drawio.undo_stack.push(drawio.shapes.pop());
	clearCanvas();
	drawCanvas();
});

__('#redo').on('click', function () {
	if (drawio.undo_stack.length === 0) return;
	clearCanvas();
	drawio.shapes.push(drawio.undo_stack.pop())
	drawCanvas();
});

__('.drawingBoard').on('mousedown', function (mouseEvent) {
	startDrawing(mouseEvent);
});

__('.drawingBoard').on('mouseup', function (mouseEvent) {
	if (drawio.selectedTool === drawio.availableTools.TEXT || !drawio.isDrawing) return;
	if (drawio.selectedTool === drawio.availableTools.MOVE) {
		stopDragging()
	} else {

		stopDrawing();
	}
});

__('.drawingBoard').on('mousemove', function (mouseEvent) {
	if (drawio.selectedTool === 'text' || !drawio.isDrawing) return;

	draw(mouseEvent);
});

// On Enter
__('#textDiv').on('keydown', function (e) {
	if (drawio.selectedTool === 'text') {
		if (e.key === 'Enter') {
			drawText();
		}
	}
});

__('#fontSelector').on('change', function () {
	let selected = __('#fontSelector')[0];
	drawio.font = selected.options[selected.selectedIndex].value;
});