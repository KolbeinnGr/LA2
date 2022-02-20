

function Shape(position) {
    this.position = position;
    drawio.ctx.strokeStyle = drawio.strokeColor;
    // console.log(drawio.ctx.strokeStyle, drawio.strokeColor)
}

Shape.prototype.render = function () { }

Shape.prototype.move = function (position) {
    this.position = position;
}

Shape.prototype.resize = function () { }


//------ Rectangle ------//
function Rectangle(position, width, height) {
    Shape.call(this, position);
    this.width = width;
    this.height = height;
}


Rectangle.prototype = Object.create(Shape.prototype);
Rectangle.prototype.constructor = Rectangle;

Rectangle.prototype.render = function (shape) {

    if (shape.stroke){
        drawio.ctx.strokeRect(this.position.x, this.position.y, this.width, this.height);
    }
    if (shape.fill) {

        drawio.ctx.fillRect(this.position.x, this.position.y, this.width, this.height);

    }

}

Rectangle.prototype.resize = function (x, y) {
    this.width = x - this.position.x;
    this.height = y - this.position.y;
}



//------ CIRCLE ------//
function Circle(position, radius) {
    Shape.call(this, position);
    this.radius = radius;
}

Circle.prototype = Object.create(Shape.prototype);
Circle.prototype.constructor = Circle;


Circle.prototype.render = function (shape) {

    drawio.ctx.beginPath();
    drawio.ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI)
    if (shape.stroke){
        drawio.ctx.stroke();
    }

    if (shape.fill) {
        drawio.ctx.fill();
    }

}

Circle.prototype.resize = function (x, y) {
    this.radius = Math.abs((x - this.position.x)) + Math.abs((y - this.position.y));
}


//------ LINE ------//
function Line(position) {
    Shape.call(this, position);
    this.endX = this.x = position.x;
    this.endY = this.y = position.y;
}

Line.prototype = Object.create(Shape.prototype);
Line.prototype.constructor = Line;


Line.prototype.render = function () {

    drawio.ctx.beginPath();
    drawio.ctx.moveTo(this.position.x, this.position.y);
    drawio.ctx.lineTo(this.endX, this.endY);
    drawio.ctx.stroke();


}

Line.prototype.resize = function (x, y) {
    drawio.ctx.lineTo(x, y)

    this.endX = x;
    this.endY = y;
}



//------ TEXT ------//
function Text(position) {
    Shape.call(this, position);
    this.textString = "";


}

Text.prototype = Object.create(Shape.prototype);
Text.prototype.constructor = Text;


Text.prototype.render = function (shape) {

    drawio.ctx.font = shape.fontSize + "px " + shape.font;
    drawio.ctx.lineWidth = Math.floor(shape.strokeSize/5);

    if (shape.fill) {
        drawio.ctx.fillText(this.textString, this.position.x, this.position.y);
        // console.log(drawio.ctx.measureText(this.textString));
    }
    if (shape.stroke) {
        drawio.ctx.strokeText(this.textString, this.position.x, this.position.y)
        // drawio.ctx.measureText(this.textString);
    }
}

Text.prototype.resize = function (button) {
    // console.log(button)
    // if (button === 'Backspace') {
    //     let tempString = this.textString;
    //     this.textString = tempString.slice(0, -1);
    //
    // }
    // else {
    //     this.textString += button;
    // }
}

//------ PEN ------//

function Pen(position) {
    Shape.call(this, position);
    this.endX = this.x = position.x;
    this.endY = this.y = position.y;

    this.pointList = [];

}

Pen.prototype = Object.create(Shape.prototype);
Pen.prototype.constructor = Pen;


// Pen.prototype.render = function () {
//     drawio.ctx.beginPath();
//     let coord = this.pointList[0];
//     drawio.ctx.moveTo(coord.x, coord.y);
//     this.pointList.forEach(coord => {
//         drawio.ctx.lineTo(coord.x, coord.y);
//     });
//     drawio.ctx.stroke();
//     drawio.ctx.closePath();
// }

Pen.prototype.render = function () {
    drawio.ctx.beginPath();
    let coord2 = this.pointList[0];
    this.pointList.forEach(coord => {
        drawio.ctx.moveTo(coord2.x, coord2.y)
        drawio.ctx.lineCap = "round";
        drawio.ctx.lineTo(coord.x, coord.y);
        coord2 = coord;

    });
    drawio.ctx.stroke();
    drawio.ctx.closePath();
}

Pen.prototype.resize = function (x, y) {
    if (x !== this.endX || y !== this.endY) {
        drawio.ctx.strokeStyle = drawio.strokeColor;
        drawio.ctx.lineWidth = drawio.strokeSize;
        drawio.ctx.beginPath();
        drawio.ctx.moveTo(this.endX, this.endY);
        drawio.ctx.lineCap = "round";
        drawio.ctx.lineTo(x, y);
        drawio.ctx.stroke();
    }

    drawio.ctx.closePath();
    this.endX = x;
    this.endY = y;

    this.pointList.push({ x: x, y: y })

}
