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

function draw(evt) {
	if (!drawio.isDrawing || drawio.selectedTool === drawio.availableTools.TEXT || (!drawio.isDragging && drawio.selectedTool === drawio.availableTools.MOVE)) return;
	let pos = getMouseXY(evt);

	if (drawio.isDragging && drawio.selectedTool === drawio.availableTools.MOVE) {

		if (typeof (drawio.selectedElement.pointList) !== "undefined") {
			movePen(pos)
		} else {
			if (drawio.selectedElement.endY && drawio.selectedElement.endX) {
				drawio.selectedElement.endY -= drawio.selectedElement.position.y - (pos.y - drawio.dragStartPos.y);
				drawio.selectedElement.endX -= drawio.selectedElement.position.x - (pos.x - drawio.dragStartPos.x);
			}
			drawio.selectedElement.position.x = pos.x - drawio.dragStartPos.x;
			drawio.selectedElement.position.y = pos.y - drawio.dragStartPos.y;
		}
	} else {
		drawio.selectedElement.resize(pos.x, pos.y);
	}
	if (drawio.selectedTool === 'pen') return;
	clearCanvas();
	drawCanvas();
}

function drawText() {
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

function downLoadImg() {
	let dlLink = document.createElement('a');
	dlLink.setAttribute('download', 'CanvasAsImage.png');

	let dataURL = drawio.canvas.toDataURL('image/png');
	let url = dataURL.replace(/^data:image\/png/, 'data:application/octet-stream');
	dlLink.setAttribute('href', url);
	dlLink.click();
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

			if (evt.offsetX && evt.offsetY) {
				showTextBox(evt)
			}
			break;
		case drawio.availableTools.PEN:
			drawio.selectedElement = new Pen(drawio.lastPos);
			break;
		case drawio.availableTools.MOVE:
			for (let i = drawio.shapes.length - 1; i >= 0; i--) {
				if (isInShape(drawio.shapes[i])) {
					drawio.dragStartPos.x = drawio.lastPos.x - drawio.shapes[i].element.position.x;
					drawio.dragStartPos.y = drawio.lastPos.y - drawio.shapes[i].element.position.y;
					drawio.selectedElement = drawio.shapes[i].element;
					drawio.isDragging = true;
					break;
				}
			}
			break;
	}
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

function stopDragging() {
	drawio.isDrawing = false;
	drawio.isDragging = false;
	drawio.selectedElement = null;
	clearCanvas();
	drawCanvas();
	drawio.undo_stack = [];
}



function movePen(pos) {
	let moveX = pos.x - drawio.lastPos.x;
	let moveY = pos.y - drawio.lastPos.y;
	drawio.lastPos = pos;
	drawio.selectedElement.pointList.forEach(p => {
		p.x += moveX;
		p.y += moveY;
	});
}

function loadFile() {
	let fileToLoad = document.getElementById('myFile').files[0]
	const fileReader = new FileReader();
	// LESUM INN JSON SKRÁ
	fileReader.onload = function (fileLoadedEvent) {
		let textFromFileLoaded = fileLoadedEvent.target.result;
		let parsed = JSON.parse(textFromFileLoaded);
		//NÚLL STILLUM SHAPE LISTANUM  
		drawio.shapes = [];
		//ÝTUM INNÍ SHAPE LISTANN 
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
				stroke: ele.stroke,
				element: drawio.selectedElement, checked: drawio.fill,
				selectedTool: ele.selectedTool,
				font: 'Arial',
				fontSize: ele.fontSize
			});
			drawio.selectedElement = null;
			drawio.isDrawing = false;
		});

		//CLEANUP
		clearCanvas();
		drawCanvas();
		drawio.undo_stack = [];
		document.getElementById('myFile').value = '';
	}
	fileReader.readAsText(fileToLoad, "UTF-8");
}

function saveFile() {
	let json = JSON.stringify(drawio.shapes);
	let blob = new Blob([json], { type: "application/json" });
	let url = URL.createObjectURL(blob);
	let a = document.createElement('a');
	a.download = 'save_file.json';
	a.href = url;
	a.click();
}

//HJALPAFÖLL 

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

function isInsideCircle(x, y, elx, ely, radius) {
	let px = x - elx;
	let py = y - ely;
	let point = px * px + py * py;
	let pointDiameter = radius * radius;
	if (point < pointDiameter) {
		return true;
	}
}

function isInShape(shape) {
	let element = shape.element
	let mouseX = drawio.lastPos.x;
	let mouseY = drawio.lastPos.y;
	let elePos = { x: element.position.x, y: element.position.y }

	// ATH HVORT SÉ HRINGUR
	if (shape.selectedTool === drawio.availableTools.CIRCLE) {

		return isInsideCircle(mouseX, mouseY, elePos.x, elePos.y, element.radius)

		// ATH HVORT SÉ KASSI
	} else if (shape.selectedTool === drawio.availableTools.RECTANGLE) {

		let width = elePos.x + element.width;
		let height = elePos.y + element.height;
		return !((mouseX < elePos.x && mouseX < width) || (mouseX > elePos.x && mouseX > width) || (mouseY < elePos.y && mouseY < height) || (mouseY > elePos.y && mouseY > height));
		// ATH HVORT SÉ PENNI
	} else if (shape.selectedTool === drawio.availableTools.PEN) {

		//HLAUPUM Í GEGNUM HNITALISTANN OG ATH HVORT ÞAÐ SÉ MATCH 	
		for (let i = 0; i < element.pointList.length; i++) {
			const p = element.pointList[i];
			if (isInsideCircle(mouseX, mouseY, p.x, p.y, shape.strokeSize)) {
				return true
			}
		}
		// ATH HVORT SÉ LÍNA
	} else if (shape.selectedTool === drawio.availableTools.LINE) {

		let A = element.position;
		let B = { x: element.endX, y: element.endY };
		let C = drawio.lastPos;

		if ((mouseX < A.x && mouseX < B.x) || (mouseX > A.x && mouseX > B.x) || (mouseY < A.y && mouseY < B.y) || (mouseY > A.y && mouseY > B.y)) {
			return false
		}

		return (Math.abs((C.y - A.y) * (B.x - A.x) - (B.y - A.y) * (C.x - A.x)) < drawio.strokeSize * 100);

	} else if (shape.selectedTool === drawio.availableTools.TEXT) {
		let textMetrix = drawio.ctx.measureText(element.textString);
		let left = elePos.x;
		let right = left + textMetrix.width;
		let top = elePos.y - textMetrix.actualBoundingBoxAscent;
		let bot = top + textMetrix.actualBoundingBoxAscent;
		if (mouseX > left && mouseX < right && mouseY > top && mouseY < bot) {
			return true;
		}
	}
	return false;
}

//CANVAS OBJECT
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
	fontSize: 25
};
