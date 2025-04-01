let canvas = document.getElementById('canvas')
    ctx = canvas.getContext('2d');


const
    pixelSize = 10;
    gridWidth = 50;
    gridHeight = 50;

canvas.width = gridWidth * pixelSize;
canvas.height = gridHeight * pixelSize;


let isDrawing = false;

canvas.addEventListener("mousedown", (event) => {
    isDrawing = true;
    draw(event);
});

canvas.addEventListener("mousemove", (event) => {
    if (isDrawing) draw(event);
});

canvas.addEventListener("mouseup", () => isDrawing = false);

function draw(event) {
    const 
        rect = canvas.getBoundingClientRect();
        x = Math.floor((event.clientX - rect.left) / pixelSize);
        y = Math.floor((event.clientY - rect.top) / pixelSize);

    ctx.fillStyle = 'black';
    ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
}


document.getElementById('refresh').onclick = () => ctx.clearRect(0, 0, canvas.width, canvas.height);