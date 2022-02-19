
window.drawio = {
    shapes: [],
    selectedShape: 'rectangle',
    ctx: document.getElementById('my-canvas').getContext('2d'),
    canvas: document.getElementById('my-canvas'),
    selectedElement: null,
    availableShapes: {
        RECTANGLE: 'rectangle',
        CIRCLE: 'circle',
        LINE: 'line',
        TEXT: 'text'
    },
    undo_stack: []
};


$(function() {
    // Document is loaded and parsed here

    function clearCanvas(){
        drawio.ctx.clearRect(0, 0, drawio.canvas.width, drawio.canvas.height);
    }

    function drawCanvas() {
        if (drawio.selectedElement) {
            drawio.selectedElement.render();
        }
        for (let i = 0; i< drawio.shapes.length; i++){

            drawio.ctx.fillStyle = drawio.shapes[i].color;
            drawio.ctx.strokeStyle = drawio.shapes[i].color;
            drawio.shapes[i].element.render(drawio.shapes[i].checked);
        }
    }


    $('.icon').on('click', function () {
        $('.icon').removeClass('selected');
        $(this).addClass('selected');
        drawio.selectedShape = $(this).data('shape');
    });


    // mousedown
    $('#my-canvas').on('mousedown', function (mouseEvent) {

        switch (drawio.selectedShape) {
            case drawio.availableShapes.RECTANGLE:
                drawio.selectedElement = new Rectangle({x: mouseEvent.offsetX, y: mouseEvent.offsetY}, 0, 0);
                break;

            case drawio.availableShapes.CIRCLE:
                drawio.selectedElement = new Circle({x: mouseEvent.offsetX, y: mouseEvent.offsetY}, 0)
                break;

            case drawio.availableShapes.LINE:
                drawio.selectedElement = new Line({x: mouseEvent.offsetX, y: mouseEvent.offsetY})
                break;

            case drawio.availableShapes.TEXT:
                drawio.selectedElement = new Text({x: mouseEvent.offsetX, y: mouseEvent.offsetY})

        }
    });


    // mousemove
    $('#my-canvas').on('mousemove', function (mouseEvent) {
        if (drawio.selectedElement === 'text') return;
        if (drawio.selectedElement) {
            clearCanvas();
            drawCanvas();
            drawio.ctx.fillStyle = document.getElementById('colorPicker').value;
            drawio.ctx.strokeStyle = document.getElementById('colorPicker').value;

            if (drawio.selectedShape==='rectangle') {
                drawio.selectedElement.resize(mouseEvent.offsetX, mouseEvent.offsetY);

            }

            if (drawio.selectedShape === 'circle') {
                drawio.selectedElement.resize(mouseEvent.offsetX, mouseEvent.offsetY)
            }

            if (drawio.selectedShape === 'line'){
                drawio.selectedElement.resize(mouseEvent.offsetX, mouseEvent.offsetY)
            }}
    });

    // mouseup
    $('#my-canvas').on('mouseup', function() {
        if (drawio.selectedShape === 'text'){

            return
        }
        drawio.shapes.push({color: document.getElementById('colorPicker').value,
            element: drawio.selectedElement, checked: $('#filled').is(':checked')});
        console.log(drawio.selectedElement)
        drawio.selectedElement = null;
        clearCanvas();
        drawCanvas();
        drawio.undo_stack = [];
    });

    // enter
    window.addEventListener('keydown', function(e){

        if (drawio.selectedShape === 'text') {
            console.log(e.keyCode)
            if (e.key === 'Enter') {
                drawio.selectedElement = null;
                drawio.undo_stack = [];

            }
            else if (e.keyCode >= 65 && e.keyCode <= 90 || e.key === 'Backspace' || "þæöðÞÆÖÐ".includes(e.key)){
                drawio.ctx.fillStyle = document.getElementById('colorPicker').value;
                drawio.ctx.strokeStyle = document.getElementById('colorPicker').value;
                drawio.selectedElement.resize(e.key)

            }
            clearCanvas();
            drawCanvas();

        }})


    // undo
    $('#undoButton').on('click', function(){
        if (drawio.shapes.length === 0){
            return
        }
        drawio.undo_stack.push(drawio.shapes.pop());
        clearCanvas();
        drawCanvas();
    })


    //redo
    $('#redoButton').on('click', function(){
        if (drawio.undo_stack.length === 0){
            return
        }
        clearCanvas();
        drawio.shapes.push(drawio.undo_stack.pop())
        drawCanvas();
    })


});
