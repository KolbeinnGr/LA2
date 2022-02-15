
window.drawio = {
    shapes: [],
    selectedShape: 'rectangle',
    ctx: document.getElementById('my-canvas').getContext('2d'),
    canvas: document.getElementById('my-canvas'),
    selectedElement: null,
    availableShapes: {
        RECTANGLE: 'rectangle'
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

                // console.log(document.getElementById('colorPicker').value)
                drawio.selectedElement = new Rectangle({x: mouseEvent.offsetX, y: mouseEvent.offsetY}, 0, 0)

                break;
        }
    });

    // mousemove
    $('#my-canvas').on('mousemove', function (mouseEvent) {
        if (drawio.selectedElement) {
            drawio.ctx.beginPath();
            drawio.ctx.fillStyle = document.getElementById('colorPicker').value;
            drawio.ctx.strokeStyle = document.getElementById('colorPicker').value;

            drawio.selectedElement.resize(mouseEvent.offsetX, mouseEvent.offsetY);
            drawio.ctx.clearRect(0, 0, drawio.canvas.width, drawio.canvas.height);
            drawCanvas();

        }
    });

    // mouseup
    $('#my-canvas').on('mouseup', function() {
        drawio.shapes.push({color: document.getElementById('colorPicker').value, element: drawio.selectedElement, checked: $('#filled').is(':checked')});
        drawio.selectedElement = null;
        clearCanvas();
        drawCanvas();
        drawio.undo_stack = [];


    });

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
