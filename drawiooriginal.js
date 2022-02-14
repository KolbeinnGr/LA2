
window.drawio = {
    shapes: [],
    selectedShape: 'rectangle',
    ctx: document.getElementById('my-canvas').getContext('2d'),
    canvas: document.getElementById('my-canvas'),
    selectedElement: null,
    availableShapes: {
        RECTANGLE: 'rectangle'
    }
};


$(function() {
    // Document is loaded and parsed here

    function drawCanvas() {
        if (drawio.selectedElement) {
            drawio.selectedElement.render();
        }
        for (let i = 0; i< drawio.shapes.length; i++){
            let shape = drawio.shapes[i].render();
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
                drawio.selectedElement = new Rectangle({x: mouseEvent.offsetX, y: mouseEvent.offsetY}, 0, 0)
                break;
        }
    });

    // mousemove
    $('#my-canvas').on('mousemove', function (mouseEvent) {
        if (drawio.selectedElement) {
            drawio.ctx.clearRect(0, 0, drawio.canvas.width, drawio.canvas.height);
            drawio.selectedElement.resize(mouseEvent.offsetX, mouseEvent.offsetY);
            drawCanvas();
        }
    });

    // mouseup
    $('#my-canvas').on('mouseup', function() {
        drawio.shapes.push(drawio.selectedElement);
        drawio.selectedElement = null;
    });

});


