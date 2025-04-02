let canvas = document.getElementById('canvas')
    ctx = canvas.getContext('2d');


const
    pixelSize = 10;
    gridWidth = 50;
    gridHeight = 50;

canvas.width = gridWidth * pixelSize;
canvas.height = gridHeight * pixelSize;


let isDrawing = false;

canvas.addEventListener('mousedown', (event) => {
    isDrawing = true;
    draw(event);
});

canvas.addEventListener('mousemove', (event) => {
    if (isDrawing) draw(event);
});

canvas.addEventListener('mouseup', () => isDrawing = false);

canvas.addEventListener('mouseleave', () => isDrawing = false);

function draw(event) {
    const 
        rect = canvas.getBoundingClientRect();
        x = Math.floor((event.clientX - rect.left) / pixelSize);
        y = Math.floor((event.clientY - rect.top) / pixelSize);

    ctx.fillStyle = 'black';
    ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
}

document.getElementById('refresh').onclick = () => ctx.clearRect(0, 0, canvas.width, canvas.height);

document.getElementById('recognize').onclick = 

function getPixelData() {
    const imageData = canvas.getImageData(0, 0, canvas.width, canvas.height);
    let pixels = [];

    for (let y = 0; y < gridHeight; y++) {
        let row = [];
        for (let x = 0; x < gridWidth; x++) {
            let index = (y * pixelSize * canvas.width + x * pixelSize) * 4;
            let r = imageData[index];
            let g = imageData[index + 1];
            let b = imageData[index + 2];
            let a = imageData[index + 3];

            let isFilled = (r + g + b) < 128 * 3;
            row.push(isFilled ? 1 : 0);
        }
        pixels.push(row);
    }
    return pixels;
}