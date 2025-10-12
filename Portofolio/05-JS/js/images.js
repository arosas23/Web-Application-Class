/**
 * This is a piece of code written in an older version of JS.
 * Modern versions of JS use other means to create functions.
 * This code is provided so you can get a glimpse of the old ways. Don't worry too much about all the code, and try just to focus on the TODO parts.
 */

// Global variable myGamePiece that will be of type component.
var myGamePiece;

// Canvas and game initialization
function startGame() {
    myGamePiece = new component(60, 60, "../images/smiley.gif", 10, 120, "image");
    myGameArea.start();
}

// Definition of the myGameArea object
var myGameArea = {
    // Declaration of a variable local to the myGameArea
    canvas: document.createElement("canvas"),
    // Definition of function start via a prototype
    start: function () {
        this.canvas.width = 480;
        this.canvas.height = 270;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        setInterval(updateGameArea, 20);
    },
    // Definition of function clear via a prototype
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
};

// Definition of the component object
function component(width, height, color, x, y, type) {
    // Declaration of several variables part of the component object.
    this.type = type;
    if (type == "image") {
        this.image = new Image();
        this.image.src = color;
    }
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;
    // Declaration of function update
    this.update = function () {
        ctx = myGameArea.context;
        // Option to draw the component as an image or as a square with a color
        if (type == "image") {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        } else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    };
    // Declaration of function newPos
    this.newPos = function (canvasWidth, canvasHeight) {
        // Sets the new position of the object with x,y coordinates
        this.x += this.speedX;
        this.y += this.speedY;

        // left limit
        if (this.x <= 0) {
            this.x = 0;
            this.speedX = -this.speedX; // invert speed (bounce)
        }
        // right limit
        if (this.x + this.width >= canvasWidth) {
            this.x = canvasWidth - this.width;
            this.speedX = -this.speedX;
        }
        // upper limit
        if (this.y <= 0) {
            this.y = 0;
            this.speedY = -this.speedY;
        }
        // lower limit
        if (this.y + this.height >= canvasHeight) {
            this.y = canvasHeight - this.height;
            this.speedY = -this.speedY;
        }
    };
}

// Global function. Independent from any object
function updateGameArea() {
    myGameArea.clear();
    myGamePiece.newPos(myGameArea.canvas.width, myGameArea.canvas.height);
    myGamePiece.update();
}

//max velocity
const max_speed = 5;

// Methods that control the movement of the object
function moveup() {
    if (myGamePiece.speedY > -max_speed) {
        myGamePiece.speedY -= 1;
    }
}

function movedown() {
    if (myGamePiece.speedY < max_speed) {
        myGamePiece.speedY += 1;
    }
}

function moveleft() {
    if (myGamePiece.speedX > -max_speed) {
        myGamePiece.speedX -= 1;
    }
}

function moveright() {
    if (myGamePiece.speedX < max_speed) {
        myGamePiece.speedX += 1;
    }
}

function resetPosition() {
    myGamePiece.x = 10;
    myGamePiece.y = 120;
    myGamePiece.speedX = 0;
    myGamePiece.speedY = 0;
}