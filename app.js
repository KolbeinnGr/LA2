window.drawio = {
	shapes: [],
	selectedShape: 'rectangle',
	ctx: document.getElementById('my-canvas').getContext('2d'),
	canvas: document.getElementById('my-canvas'),
	selectedElement: null,
	availableShapes: {
		RECTANGLE: 'rectangle'
	},
	isDrawing: false, currPos: {},
	strokeSize: 10,
	strokeColor: "#000000",
	fillColor: "#000000",
	toolSelected: "pen",
};




function getMouseXY(evt) {
	const transform = drawio.ctx.getTransform();

	return { x: evt.offsetX - transform.e, y: evt.offsetY - transform.f };

}


$('.drawingBoard').on('mousedown', function (mouseEvent) {
	drawio.lastPos = getMouseXY(mouseEvent);
	drawio.isDrawing = true;

});

$('.drawingBoard').on('mouseup', function (mouseEvent) {
	drawio.isDrawing = false;
	drawio.ctx.closePath();
	console.log(drawio.lastPos)
});

$('.drawingBoard').on('mousemove', function (mouseEvent) {
	if (!drawio.isDrawing) return;
	let pos = getMouseXY(mouseEvent);
	draw(pos.x, pos.y, 2);
});




function draw(x, y, size) {
	if (x !== drawio.lastPos.x || y !== drawio.lastPos.y) {
		drawio.ctx.fillStyle = "#000000";
		drawio.ctx.lineWidth = 2 * size;
		drawio.ctx.beginPath();
		drawio.ctx.moveTo(drawio.lastPos.x, drawio.lastPos.y);
		drawio.ctx.lineTo(x, y);
		drawio.ctx.stroke();
	}

	drawio.ctx.closePath();
	drawio.lastPos.x = x;
	drawio.lastPos.y = y;
}

$('#save').on('click', function () {
	save();
});

function save() {
	let downloadLink = document.createElement('a');
	downloadLink.setAttribute('download', 'CanvasAsImage.png');

	let dataURL = drawio.canvas.toDataURL('image/png');
	let url = dataURL.replace(/^data:image\/png/, 'data:application/octet-stream');
	downloadLink.setAttribute('href', url);
	downloadLink.click();

}
