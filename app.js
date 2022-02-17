let drawio = {
	shapes: [],
	undo_stack: [],
	selectedTool: 'pen',
	ctx: document.getElementById('my-canvas').getContext('2d'),
	canvas: document.getElementById('my-canvas'),
	selectedElement: null,
	availableTools: {
		RECTANGLE: 'square',
		CIRCLE: 'circle',
		LINE: 'line',
		TEXT: 'text',
		PEN: 'pen'
	},
	isDrawing: false, currPos: {},
	strokeSize: 10,
	strokeColor: "#000000",
	fillColor: "#ff0000",
	fill: true
};


function clearCanvas() {
	drawio.ctx.clearRect(0, 0, drawio.canvas.width, drawio.canvas.height);
}



function drawCanvas() {
	let shape;
	for (let i = 0; i < drawio.shapes.length; i++) {
		shape = drawio.shapes[i];

		drawio.ctx.fillStyle = shape.fillColor;
		drawio.ctx.strokeStyle = shape.strokeColor;
		drawio.ctx.lineWidth = shape.strokeSize;


		//drawio.ctx.fillStyle = drawio.shapes[i].fillStyle;	
		//drawio.ctx.strokeStyle = drawio.shapes[i].strokeStyle;
		drawio.shapes[i].element.render();
	}

	if (drawio.selectedElement) {
		drawio.selectedElement.render();
	}
}


function getMouseXY(evt) {
	return { x: evt.offsetX, y: evt.offsetY }
}


function downLoadImg() {
	let downloadLink = document.createElement('a');
	downloadLink.setAttribute('download', 'CanvasAsImage.png');

	let dataURL = drawio.canvas.toDataURL('image/png');
	let url = dataURL.replace(/^data:image\/png/, 'data:application/octet-stream');
	downloadLink.setAttribute('href', url);
	downloadLink.click();

}


function startDrawing(evt) {
	drawio.lastPos = getMouseXY(evt);
	drawio.isDrawing = true;
	switch (drawio.selectedTool) {
		case drawio.availableTools.RECTANGLE:
			drawio.selectedElement = new Rectangle(drawio.lastPos, 0, 0);
			break;
		case drawio.availableTools.CIRCLE:
			console.log("völudm circle")
			drawio.selectedElement = new Circle(drawio.lastPos, 0);
			break;
		case drawio.availableTools.LINE:
			drawio.selectedElement = new Line(drawio.lastPos);
			break;
		case drawio.availableTools.TEXT:
			drawio.selectedElement = new Text(drawio.lastPos);
			break;
		case drawio.availableTools.PEN:
			drawio.selectedElement = new Pen(drawio.lastPos);
			break;
	}
};

function stopDrawing() {
	if (!drawio.isDrawing) return;

	drawio.isDrawing = false;
	if (drawio.selectedTool === 'text') {
		return
	}
	drawio.shapes.push({
		strokeColor: drawio.strokeColor,
		strokeSize: drawio.strokeSize,
		fillColor: drawio.fillColor,
		fill: drawio.fill,
		element: drawio.selectedElement, checked: false//$('#filled').is(':checked')
	});
	drawio.selectedElement = null;
	clearCanvas();
	drawCanvas();
	drawio.undo_stack = [];
};

function draw(evt) {
	if (!drawio.isDrawing || drawio.selectedTool === 'text') return;
	let pos = getMouseXY(evt);
	drawio.selectedElement.resize(pos.x, pos.y);
	clearCanvas();
	drawCanvas();
}


/*Events*/

__('#save').on('click', function () {
	console.log("save stuff")
});
__('#getImg').on('click', function () {
	downLoadImg()
});

__('#clear').onClick(function () {
	clearCanvas();
	drawio.shapes = [];
});

__('.type input').on("change", function () {
	console.log("tool selected")
	drawio.selectedTool = this.id;
})


__('#stroke-color').on("change", function () {
	drawio.strokeColor = this.value;
	drawio.ctx.strokeStyle = this.value;
})


__('.drawingBoard').on('mousedown', function (mouseEvent) {
	startDrawing(mouseEvent);

});

__('.drawingBoard').on('mouseup', function (mouseEvent) {
	stopDrawing();

});

__('.drawingBoard').on('mousemove', function (mouseEvent) {
	draw(mouseEvent);
});
