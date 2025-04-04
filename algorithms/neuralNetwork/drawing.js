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

document.getElementById('recognize').onclick = getPixelData;

function getPixelData() {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let pixels = new Array(gridHeight * gridWidth);
    let c = 0

    for (let y = 0; y < gridHeight; y++) {
        for (let x = 0; x < gridWidth; x++) {
            let index = (x * pixelSize + y * pixelSize * canvas.width) * 4;
            let a = imageData.data[index + 3];
            pixels[c++] = (a == 0) ? 1 : 0;
        }
    }
    console.log(pixels);
    return pixels;
}
