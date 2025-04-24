let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');

canvas.width = 500;
canvas.height = 500;

let points = [];

// Класс точки
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

// ---------- Генетический алгоритм ----------


const POPULATION_SIZE = 50;      // Размер популяции
const GENERATIONS = 50000;        // Количество поколений
const MUTATION_RATE = 0.05;      // Вероятность мутации
const TOURNAMENT_SIZE = 10;       // Размер турнира для селекции

let bestPath = [];
let minPath = Infinity;
let population = [];

// Функция для вычисления расстояния между двумя точками
function distance(p1, p2) {
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
}

// Функция для создания начальной популяции
function createInitialPopulation() {
    population = [];
    for (let i = 0; i < POPULATION_SIZE; i++) {
        let path = [];
        let remainingCities = Array.from({ length: points.length }, (_, index) => index);
        while (remainingCities.length > 0) {
            const randomIndex = Math.floor(Math.random() * remainingCities.length);
            path.push(remainingCities.splice(randomIndex, 1)[0]);
        }
        population.push(path);
    }
}

// Функция для вычисления длины пути
function calculateFitness(path) {
    let totalDistance = 0;
    for (let i = 0; i < path.length - 1; i++) {
        totalDistance += distance(points[path[i]], points[path[i + 1]]);
    }
    totalDistance += distance(points[path[path.length - 1]], points[path[0]]); // Замкнуть путь
    return totalDistance;
}


function tournamentSelection() {
    let tournament = [];
    for (let i = 0; i < TOURNAMENT_SIZE; i++) {
        const randomIndex = Math.floor(Math.random() * POPULATION_SIZE);
        tournament.push(population[randomIndex]);
    }
    tournament.sort((a, b) => calculateFitness(a) - calculateFitness(b));
    return tournament[0];  // Лучший путь из турнира
}

// Функция кроссовера (смешивание двух путей)
function crossover(parent1, parent2) {
    let start = Math.floor(Math.random() * parent1.length);
    let end = Math.floor(Math.random() * parent1.length);
    if (start > end) {
        [start, end] = [end, start];
    }

    let child = new Array(parent1.length);
    for (let i = start; i <= end; i++) {
        child[i] = parent1[i];
    }

    let currentIndex = 0;
    for (let i = 0; i < parent2.length; i++) {
        if (!child.includes(parent2[i])) {
            while (child[currentIndex] !== undefined) {
                currentIndex++;
            }
            child[currentIndex] = parent2[i];
        }
    }

    return child;
}

function mutate(path) {
    if (Math.random() < MUTATION_RATE) {
        const index1 = Math.floor(Math.random() * path.length);
        const index2 = Math.floor(Math.random() * path.length);
        [path[index1], path[index2]] = [path[index2], path[index1]];  // Перестановка
    }
}

function createNextGeneration() {
    let newPopulation = [];
    for (let i = 0; i < POPULATION_SIZE; i++) {
        const parent1 = tournamentSelection();
        const parent2 = tournamentSelection();
        let child = crossover(parent1, parent2);
        mutate(child);
        newPopulation.push(child);
    }
    population = newPopulation;
}


function findBestPath() {
    population.sort((a, b) => calculateFitness(a) - calculateFitness(b));
    const bestPathInPopulation = population[0];
    const pathLength = calculateFitness(bestPathInPopulation);
    if (pathLength < minPath) {
        minPath = pathLength;
        bestPath = bestPathInPopulation;
    }
}



function arraysEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) return false;
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) return false;
    }
    return true;
}

// ---------- Отрисовка ----------

const delay = 0;
const radiusPoint = 10;
const stylePoint = '#598D66';
const pheromoneStyle = "rgb(167, 255, 114, 0.1)";
const pheromoneWeight = 3;
const pathStyle = 'black';
const pathWeight = 5;

function drawPoint(currentPoint) {
    ctx.fillStyle = stylePoint;
    ctx.beginPath();
    ctx.arc(currentPoint.x, currentPoint.y, radiusPoint, 0, Math.PI * 2);
    ctx.fill();
}

function clearLines() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let point of points) {
        drawPoint(point);
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
    ctx.lineTo(points[bestPath[0]].x, points[bestPath[0]].y); // Замкнуть путь
    ctx.stroke();
}

// ---------- Основной цикл ----------

async function runGeneticAlgorithm() {
    createInitialPopulation();
    let previousBestPath = [...bestPath];

    for (let generation = 0; generation < GENERATIONS; generation++) {

        createNextGeneration();

        findBestPath();
        if (!arraysEqual(bestPath, previousBestPath)) {
            clearLines();
            previousBestPath = [...bestPath];

            await drawPath(bestPath, points, delay);
            await new Promise(resolve => setTimeout(resolve, 250));
        }
    }
    await drawPath(bestPath, points, delay);
    await new Promise(resolve => setTimeout(resolve, 250));

}


document.addEventListener("DOMContentLoaded", () => {
    refresh();
});

document.getElementById('refresh').onclick = refresh;

canvas.addEventListener('click', function(e) {
    const point = new Point(e.offsetX, e.offsetY);
    drawPoint(point);
    points.push(point);
});

document.getElementById('createPath').onclick = runGeneticAlgorithm;

document.getElementById('alpha').addEventListener('change', function() {
    alpha = +this.value;
    console.log('alpha = ' + alpha);
});

document.getElementById('beta').addEventListener('change', function() {
    beta = +this.value;
    console.log('beta = ' + beta);
});

// Функция для очистки канваса и данных
function refresh() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    points = [];
    minPath = Infinity;
    bestPath = [];
}
