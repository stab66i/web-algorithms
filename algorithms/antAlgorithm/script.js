let canvas = document.getElementById('canvas')
    ctx = canvas.getContext('2d');

canvas.width = 500;
canvas.height = 500;

let backgroundColor = "#598D66";
canvas.style.background = backgroundColor;

//---------- drawing ----------

let radiusPoint = 10;


function drawPoint(x, y) {
    ctx.fillStyle = 'white';

    ctx.beginPath();
    ctx.arc(x, y, radiusPoint, 0, Math.PI * 2);
    ctx.fill();
}

function refresh() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

//-----------algorithm----------







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

    drawPoint(x, y);

    points.push({x, y});
});

