let canvas = document.getElementById('canvas')
    ctx = canvas.getContext('2d');

canvas.width = 500;
canvas.height = 500;

//---------- drawing ----------

let radiusPoint = 10;
let stylePoint = '#598D66'

let pheromoneStyle = "rgb(167, 255, 114, 0.1)";
let pheromoneWeight = 0.8;

function drawPoint(currentPoint) {
    ctx.fillStyle = stylePoint;

    ctx.beginPath();
    ctx.arc(currentPoint.x, currentPoint.y, radiusPoint, 0, Math.PI * 2);
    ctx.fill();

    drawPheromone(currentPoint);
}

function drawPheromone(currentPoint) {
    ctx.strokeWeight = pheromoneWeight;
    ctx.strokeStyle = pheromoneStyle;
    if (points.length >= 1) {
        for (let point of points) {
            if (point != currentPoint) {
                ctx.moveTo(currentPoint.x, currentPoint.y);
                ctx.lineTo(point.x, point.y);
                ctx.stroke();
            }
        }
    }
}

function refresh() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

//-----------algorithm----------
let alpha = 1
    beta = 1;






//----------- main -------------
let points = [];



//------------events-----------

document.addEventListener("DOMContentLoaded", () => {
    refresh();
});

document.getElementById('clear').onclick = clear;

function clear() {
    refresh();
    points = [];
}

canvas.addEventListener('click', function(e) {
    let x = e.offsetX;
    let y = e.offsetY;

    drawPoint({x, y});

    points.push({x, y});
});

