let canvas = document.getElementById('canvas')
    ctx = canvas.getContext('2d');

canvas.width = 500;
canvas.height = 500;

let points = [];

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Ant {
    constructor(startPosition, vertexes) {
        this.position = startPosition;
        this.vertexes = vertexes;
        this.visited = new Set();
        this.visited.add(startPosition);
        this.start = startPosition;
    }

    choseNextPoint(pheromones, distanceBetweenCities) {
        const unvisitedPoints = this.vertexes.filter(vertex => !this.visited.has(vertex)); //дебил не робит
        
        if (unvisitedPoints.length === 0) {
            console.log('Все точки посещены');
            return null;
        }

        //желание
        let desiresToMove = {};
        let sum = 0;
        for (let p of unvisitedPoints) {
            sum += Math.pow(pheromones[this.position][p], alpha) * Math.pow(distanceBetweenCities[this.position][p], beta);
        }
        for (let p of unvisitedPoints) {
            desiresToMove[p] = Math.pow(pheromones[this.position][p], alpha) * Math.pow(distanceBetweenCities[this.position][p], beta) / sum;
        }
        const rand = Math.random();
        sum = 0;
        for (let p in desiresToMove) {
            sum += desiresToMove[p];
            if (sum >= rand){
                this.visited.add(Number(p));
                this.position = Number(p);
                return Number(p);
            } 
        }
        console.log('не захотел никуда идти:(');
        return null;

    }
}
//---------- drawing ----------
const delay = 200;

const radiusPoint = 10;
const stylePoint = '#598D66'

const pheromoneStyle = "rgb(167, 255, 114, 0.1)";
const pheromoneWeight = 3;

const pathStyle = 'black';
const pathWeight = 5;

function drawPoint(currentPoint) {
    ctx.fillStyle = stylePoint;

    ctx.beginPath();
    ctx.arc(currentPoint.x, currentPoint.y, radiusPoint, 0, Math.PI * 2);
    ctx.fill();

    drawPheromone(currentPoint, points);
}

function drawPheromone(currentPoint, points) {
    ctx.beginPath();
    ctx.lineWidth = pheromoneWeight;
    ctx.strokeStyle = pheromoneStyle;

    if (points.length >= 1) {
        for (let point of points) {
            if (point !== currentPoint) {
                ctx.moveTo(currentPoint.x, currentPoint.y);
                ctx.lineTo(point.x, point.y);
            }
        }
        ctx.stroke();
    }
}

function drawPath(pheromones, points, delay) {
    ctx.lineWidth = pathWeight;
    ctx.strokeStyle = pathStyle;

    let visited = new Set();
    let path = [];
    let current = 0;

    while (visited.size < points.length) {
        visited.add(current);
        path.push(current);

        let next = -1;
        let maxPheromone = -Infinity;

        for (let j = 0; j < pheromones.length; j++) {
            if (!visited.has(j) && pheromones[current][j] > maxPheromone) {
                maxPheromone = pheromones[current][j];
                next = j;
            }
        }

        if (next === -1) break;
        current = next;
    }

    path.push(path[0]);

    let index = 0;

    function drawNextSegment() {
        if (index >= path.length - 1) return;

        let start = points[path[index]];
        let end = points[path[index + 1]];

        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();

        index++;
        setTimeout(drawNextSegment, delay);
    }

    drawNextSegment();
}


function refresh() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    points = [];
    pheromones = [];
    distanceBetweenCities = [];
}

//-----------algorithm----------
let 
    alpha = 1, beta = 1;
const 
    Q = 200;
    countOfIterations = 10000,
    evaporation = 0.64, //коэфициент испарения
    initialPheromones = 0.2; //начальное количество феромона на ребрах

let 
    distanceBetweenCities = [],
    pheromones = [];

function findDistanceBetweenCities(distanceBetweenCities, points) {
    for (let i = 0; i < points.length; i++) {
        let distance = [];
        for (let j = 0; j < points.length; j++) {
            let dist = Q / Math.sqrt(Math.pow(points[i].x - points[j].x, 2) + Math.pow(points[i].y - points[j].y, 2));
            distance.push(dist);
        }
        distanceBetweenCities.push(distance);
    }
}
    
function initializePheromones(pointsLength, pheromones) {
    for (let i = 0; i < pointsLength; i++) {
        let pheromoneRow = [];
        for (let j = 0; j < pointsLength; j++) {
            if (i == j) pheromoneRow.push(0);
            else pheromoneRow.push(initialPheromones);
        }
        pheromones.push(pheromoneRow);
    }
}

function antAlgorithm(distanceBetweenCities, pheromones, points, countOfIterations) {
    const countOfAnts = points.length;
    findDistanceBetweenCities(distanceBetweenCities, points);
    initializePheromones(points.length, pheromones);
    let vertexes = Array.from({length: points.length}, (v, k) => k);

    for (let iteration = 0; iteration < countOfIterations; iteration++) {
        let startPosition = 0;
        let ways = new Array(countOfAnts);
        let sumDistance = new Array(countOfAnts);

        for (let numberOfAnt = 0; numberOfAnt < countOfAnts; numberOfAnt++) {
            let ant = new Ant(startPosition, vertexes);
            ways[numberOfAnt] = new Array(points.length);
            ways[numberOfAnt][0] = startPosition;
            sumDistance[numberOfAnt] = 0;

            for (let i = 1; i < points.length; i++) {
                const nextPosition = ant.choseNextPoint(pheromones, distanceBetweenCities);
                ways[numberOfAnt][i] = nextPosition;
                sumDistance[numberOfAnt] += distanceBetweenCities[startPosition][nextPosition];
                startPosition = nextPosition;
            }

            ways[numberOfAnt][-1] = ant.start;
            sumDistance[numberOfAnt] += distanceBetweenCities[startPosition][ant.start];
        }
        for (let i = 0; i < points.length; i++) { //испарение феромонов
            for (let j = 0; j < points.length; j++) {
                if (i != j) {
                    pheromones[i][j] = pheromones[i][j] * evaporation;
                }
            }    
        }

        for (let i = 0; i < countOfAnts; i++) {
            for (let j = 1; j < points.length; j++) {
                pheromones[ways[i][j - 1]][ways[i][j]] += Q / sumDistance[i];
            }
        }
    }
}
//----------- main -------------



//------------events-----------

document.addEventListener("DOMContentLoaded", () => {
    refresh();
});

document.getElementById('refresh').onclick = refresh;

canvas.addEventListener('click', function(e) {
    const point = new Point(e.offsetX, e.offsetY);

    drawPoint(point);

    points.push(point);
});

document.getElementById('createPath').onclick = createPath;

document.getElementById('alpha').addEventListener('change', function() {
    alpha = +this.value;
});

document.getElementById('beta').addEventListener('change', function() {
    beta = +this.value;
});

function createPath() {
    antAlgorithm(distanceBetweenCities, pheromones, points, countOfIterations);
    drawPath(pheromones, points, delay);
}