

function Shape(position){
    this.position = position;
}

Shape.prototype.render = function() {}

Shape.prototype.move = function (position) {
    this.position = position;
}

Shape.prototype.resize = function () {}


function Rectangle(position, width, height) {
    Shape.call(this, position);
    this.width = width;
    this.height = height;
}

// Assign the prototype
Rectangle.prototype = Object.create(Shape.prototype);
Rectangle.prototype.constructor = Rectangle;

Rectangle.prototype.render = function(checked) {
    // rectangle rendering
    if (checked === undefined){
        checked = $('#filled').is(':checked');
    }

    if (checked){
        // console.log(checked)
        drawio.ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
    else if (!checked){
        drawio.ctx.strokeRect(this.position.x, this.position.y, this.width, this.height);
    }

}

Rectangle.prototype.resize = function(x, y) {

    this.width = x - this.position.x;
    this.height = y - this.position.y;
}




function Circle(position, radius) {
    Shape.call(this, position);

    this.radius = radius;
}

// Assign the prototype
Circle.prototype = Object.create(Shape.prototype);
Circle.prototype.constructor = Circle;


Circle.prototype.render = function(checked) {

    drawio.ctx.beginPath();
    drawio.ctx.arc(this.position.x, this.position.y, this.radius, 0, 2*Math.PI)
    drawio.ctx.stroke();

    if (checked){
        drawio.ctx.fill();
    }

}

Circle.prototype.resize = function(x, y) {
    this.radius = Math.abs((x - this.position.x)) + Math.abs(( y - this.position.y));
    }


function Line(position) {
    Shape.call(this, position);
    this.x = position.x
    this.y = position.y
    let endX = 0;
    let endY = 0;
}

Line.prototype = Object.create(Shape.prototype);
Line.prototype.constructor = Line;


Line.prototype.render = function() {

    drawio.ctx.beginPath();
    drawio.ctx.moveTo(this.position.x, this.position.y);
    drawio.ctx.lineTo(this.endX, this.endY);
    drawio.ctx.stroke();


}

Line.prototype.resize = function(x, y) {
    drawio.ctx.lineTo(x,y)

    this.endX = x;
    this.endY = y;
}


