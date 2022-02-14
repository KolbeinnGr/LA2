

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

