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
        const unvisitedPoints = this.vertexes.filter(vertex => !this.visited.has(vertex));
        
        if (unvisitedPoints.length === 0) {
            console.log('Все точки посещены');
            return null;
        }

        //желание
        let desiresToMove = {};
        let sum = 0;
        const K = 200;
        for (let p of unvisitedPoints) {
            sum += Math.pow(pheromones[this.position][p], alpha) * Math.pow(K / distanceBetweenCities[this.position][p], beta);
        }
        for (let p of unvisitedPoints) {
            desiresToMove[p] = Math.pow(pheromones[this.position][p], alpha) * Math.pow(K / distanceBetweenCities[this.position][p], beta) / sum;
        }
        const rand = Math.random();
        sum = 0;
        let last;
        for (let p in desiresToMove) {
            sum += desiresToMove[p];
            last = p;
            if (sum >= rand){
                this.visited.add(Number(p));
                this.position = Number(p);
                return Number(p);
            } 
        }
        console.log('не захотел никуда идти:(');
        return Number(last);

    }
}
//---------- drawing ----------
const delay = 200;

const radiusPoint = 10;
const stylePoint = '#56bf70'

const pheromoneStyle = "rgb(36,195,223)";
const pheromoneWeight = 3;

const pathStyle = 'black';
const pathWeight = 4;

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

async function drawPath(bestPath, points, delay) {
    ctx.lineWidth = pathWeight;
    ctx.strokeStyle = pathStyle;

    ctx.beginPath();
    ctx.moveTo(points[bestPath[0]].x, points[bestPath[0]].y);

    for (let i = 1; i < bestPath.length; i++) {
        ctx.lineTo(points[bestPath[i]].x, points[bestPath[i]].y);
        ctx.stroke();
        
        await new Promise(resolve => setTimeout(resolve, delay));
    }
}

//-----------algorithm----------
let
    bestPath = [];


function distance(a, b) {
    return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
}

function totalDistance(path, points) {
    let dist = 0;
    for (let i = 1; i < path.length; i++) {
        dist += distance(points(path[i-1]), points(path[i]));
    }
    dist += distance(points(path[path.length - 1]), points(path[0]));
    return dist;
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

    return pheromones;
}

function genAlgorithm(distanceBetweenCities, points) {
    findDistanceBetweenCities(distanceBetweenCities, points);

}

function antAlgorithm(distanceBetweenCities, pheromones, points, countOfIterations) {
    const countOfAnts = points.length;//это переместить
    findDistanceBetweenCities(distanceBetweenCities, points);
    initializePheromones(points.length, pheromones);
    console.log(points.length);
    let vertexes = Array.from({length: points.length}, (v, k) => k);
    for (let iteration = 0; iteration < countOfIterations; iteration++) {
        console.log(iteration + 1);
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

            ways[numberOfAnt][points.length] = ant.start;
            sumDistance[numberOfAnt] += distanceBetweenCities[startPosition][ant.start];
            if (sumDistance[numberOfAnt] < minPath) {
                bestPath = ways[numberOfAnt];
                minPath = sumDistance[numberOfAnt];
            }
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
function refresh() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    points = [];
    pheromones = [];
    distanceBetweenCities = [];
    minPath = Infinity;
    bestPath = [];
}


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
    console.log('alpha = ' + alpha);
});

document.getElementById('beta').addEventListener('change', function() {
    beta = +this.value;
    console.log('beta = ' + beta);
});

function createPath() {
    antAlgorithm(distanceBetweenCities, pheromones, points, countOfIterations);
    drawPath(bestPath, points, delay);
}