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
		PEN: 'pen',
		MOVE: 'move'
	},
	isDrawing: false,
	isDragging: false,
	lastPos: {},
	dragStartPos: {},
	strokeSize: 10,
	strokeColor: "#000000",
	stroke: true,
	fillColor: "#ff0000",
	fill: true,
	font: 'Arial',
	fontSize: 25 + 'px'

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
		drawio.shapes[i].element.render(drawio.shapes[i]);
	}

	if (drawio.selectedElement) {
		drawio.selectedElement.render(
			{
				strokeColor: drawio.strokeColor,
				strokeSize: drawio.strokeSize,
				fillColor: drawio.fillColor,
				fill: drawio.fill,
				stroke: drawio.stroke
			});
	}
}


function getMouseXY(evt) {
	return { x: evt.offsetX, y: evt.offsetY }
}

function hideTextBox() {
	__('#textBox')[0].value = ""
	__('#textDiv').css('visibility', 'hidden')
}

function showTextBox(evt) {
	__('#textDiv').css('visibility', 'visible').css('top', evt.clientY + 'px').css('left', evt.clientX + 'px');
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
	drawio.isDragging = false;
	switch (drawio.selectedTool) {
		case drawio.availableTools.RECTANGLE:
			drawio.selectedElement = new Rectangle(drawio.lastPos, 0, 0);
			break;
		case drawio.availableTools.CIRCLE:
			drawio.selectedElement = new Circle(drawio.lastPos, 0);
			break;
		case drawio.availableTools.LINE:
			drawio.selectedElement = new Line(drawio.lastPos);
			break;
		case drawio.availableTools.TEXT:
			drawio.selectedElement = new Text(drawio.lastPos);
			// TODO skoða hvort þetta eigi ekki heima á betri stað. lítur asnalega út að hafa þetta hér.
			if (evt.offsetX && evt.offsetY) {
				showTextBox(evt)
			}
			break;
		case drawio.availableTools.PEN:
			drawio.selectedElement = new Pen(drawio.lastPos);
			break;
		case drawio.availableTools.MOVE:
			//drawio.selectedElement = null;
			for (var i = 0; i < drawio.shapes.length; i++) {
				if (isInShape(drawio.shapes[i].element)) {
					drawio.dragStartPos.x = drawio.lastPos.x - drawio.shapes[i].element.position.x;
					drawio.dragStartPos.y = drawio.lastPos.y - drawio.shapes[i].element.position.y;
					drawio.selectedElement = drawio.shapes[i].element;
					drawio.isDragging = true;
					//	return;
					break;
				}

			}
			break;
	}
}


function isInShape(shape) {

	let mouseX = drawio.lastPos.x;
	let mouseY = drawio.lastPos.y;
	let eleX = shape.position.x;
	let eleY = shape.position.y;
	console.log("---->" + shape.radius);
	if (shape.radius) {
		console.log("hringur")
		var dx = mouseX - eleX;
		var dy = mouseY - eleY;
		if (dx * dx + dy * dy < shape.radius * shape.radius) {
			return (true);
		}
	} else if (shape.width) {
		console.log("skoða kassa", shape.width, shape.height);

		var rLeft = eleX;
		var rRight = eleX + shape.width;
		var rTop = eleY;
		var rBott = eleY + shape.height;
		if (mouseX > rLeft && mouseX < rRight && mouseY > rTop && mouseY < rBott) {
			return (true);
		}
	}

	return (false);
}


function stopDrawing() {
	if (!drawio.isDrawing || drawio.selectedTool === drawio.availableTools.TEXT) {
		return
	}

	drawio.isDrawing = false;
	drawio.shapes.push({
		strokeColor: drawio.strokeColor,
		strokeSize: drawio.strokeSize,
		fillColor: drawio.fillColor,
		fill: drawio.fill,
		element: drawio.selectedElement, checked: drawio.fill,
		selectedTool: drawio.selectedTool,
		stroke: drawio.stroke
	});

	drawio.selectedElement = null;
	clearCanvas();
	drawCanvas();
	drawio.undo_stack = [];
}

function stopDraging() {
	drawio.isDrawing = false;
	drawio.isDragging = false;
	drawio.selectedElement = null;
	clearCanvas();
	drawCanvas();
	drawio.undo_stack = [];
}

function draw(evt) {
	if (!drawio.isDrawing || drawio.selectedTool === drawio.availableTools.TEXT || (!drawio.isDragging && drawio.selectedTool === drawio.availableTools.MOVE)) return;
	let pos = getMouseXY(evt);

	if (drawio.isDragging && drawio.selectedTool === drawio.availableTools.MOVE) {
		drawio.selectedElement.position.x = pos.x - drawio.dragStartPos.x;
		drawio.selectedElement.position.y = pos.y - drawio.dragStartPos.y;
	} else {
		drawio.selectedElement.resize(pos.x, pos.y);
	}

	if (drawio.selectedTool === 'pen') return;
	clearCanvas();
	drawCanvas();
}

function drawText(e) {
	drawio.fontSize = __('#fontSize')[0].value

	drawio.selectedElement.textString = document.getElementById('textBox').value
	drawio.shapes.push({
		strokeColor: drawio.strokeColor,
		strokeSize: drawio.strokeSize,
		fillColor: drawio.fillColor,
		fill: drawio.fill,
		stroke: drawio.stroke,
		element: drawio.selectedElement, checked: drawio.fill,
		selectedTool: drawio.selectedTool,
		font: drawio.font,
		fontSize: drawio.fontSize
	});
	drawio.selectedElement = null;
	drawio.undo_stack = [];
	drawio.isDrawing = false;


	hideTextBox();
	clearCanvas();
	drawCanvas();


}

function loadFile() {
	let fileToLoad = document.getElementById('myFile').files[0]

	const fileReader = new FileReader();
	fileReader.onload = function (fileLoadedEvent) {
		let textFromFileLoaded = fileLoadedEvent.target.result;
		let parsed = JSON.parse(textFromFileLoaded);

		drawio.shapes = [];
		parsed.forEach(ele => {
			drawio.selectedTool = ele.selectedTool
			startDrawing({ offsetX: ele.element.offsetX, offsetY: ele.element.offsetY })

			for (let prop in ele.element) {
				drawio.selectedElement[prop] = ele.element[prop];

			}
			drawio.shapes.push({
				strokeColor: ele.strokeColor,
				strokeSize: ele.strokeSize,
				fillColor: ele.fillColor,
				fill: ele.fill,
				element: drawio.selectedElement, checked: drawio.fill,
				selectedTool: ele.selectedTool
			});
			drawio.selectedElement = null;
		});
		clearCanvas();
		drawCanvas();
		drawio.undo_stack = [];
		document.getElementById('myFile').value = '';
	}

	fileReader.readAsText(fileToLoad, "UTF-8");
}

function saveFile() {
	console.log("save stuff")
	let json = JSON.stringify(drawio.shapes);
	let blob = new Blob([json], { type: "application/json" });
	let url = URL.createObjectURL(blob);
	let a = document.createElement('a');
	a.download = 'save_file.json';
	a.href = url;
	a.textcontent = "Save json";
	a.click();
}


/*Events*/

// SAVE TO FILE
__('#save').on('click', function () {
	saveFile();
});

// LOAD FROM FILE
__('#submitButton').on('click', function () {
	loadFile();
})

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
	console.log("tool selected")
	drawio.selectedTool = this.id;
	if (drawio.selectedTool !== 'text') {
		hideTextBox()
	}
})

__('#stroke-color').on("change", function () {
	drawio.strokeColor = this.value;
	drawio.ctx.strokeStyle = this.value;
})

__('#stroke-size').on('change', function () {
	drawio.strokeSize = this.value;
	drawio.ctx.lineWidth = this.value;
})

__('#fill-color').on('change', function () {
	drawio.fillColor = this.value;
	drawio.ctx.fillStyle = this.value;
})

__('#filled').on('change', function () {
	drawio.fill = !drawio.fill;
	if (!drawio.fill) {
		__('#sameColorOutline')[0].checked = false;
		drawio.stroke = true;
	}
})

__('#sameColorOutline').on('change', function () {
	if (__('#filled')[0].checked) {
		drawio.stroke = !drawio.stroke;
	}
	else {
		__('#sameColorOutline')[0].checked = false;
	}
})


__('#undo').on('click', function () {
	if (drawio.shapes.length === 0) return;
	drawio.undo_stack.push(drawio.shapes.pop());
	clearCanvas();
	drawCanvas();
})

__('#redo').on('click', function () {
	if (drawio.undo_stack.length === 0) return;
	clearCanvas();
	drawio.shapes.push(drawio.undo_stack.pop())
	drawCanvas();
})

__('.drawingBoard').on('mousedown', function (mouseEvent) {
	startDrawing(mouseEvent);
});

__('.drawingBoard').on('mouseup', function (mouseEvent) {
	if (drawio.selectedTool === drawio.availableTools.TEXT || !drawio.isDrawing) return;
	if (drawio.selectedTool === drawio.availableTools.MOVE) {
		stopDraging()
	} else {

		stopDrawing();
	}
});

__('.drawingBoard').on('mousemove', function (mouseEvent) {
	if (drawio.selectedTool === 'text' || !drawio.isDrawing) return;
	console.log(drawio.selectedElement)
	draw(mouseEvent);
});

// On Enter
__('#textBox').on('keydown', function (e) {
	if (drawio.selectedTool === 'text') {
		if (e.key === 'Enter') {
			drawText(e);
		}
	}
})


// TODO skoða hvort það þurfi þetta hér eða hafa þetta allt loadað þegar það er submittað texta með enter
__('#fontSelector').on('change', function () {
	let selected = __('#fontSelector')[0];
	drawio.font = selected.options[selected.selectedIndex].value;
})