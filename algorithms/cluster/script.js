const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const points = [];
const colors = ['red','blue','green','orange','purple','cyan','magenta','lime','brown','pink'];

canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    points.push({ x, y, cluster:null});
    drawPoint(x, y);
});

function drawPoint(x, y, color = 'black', size = 5) {
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = "#333";
    ctx.stroke();
}

function runKMeans (){
    const k = parseInt(document.getElementById('k').value);
    if (points.length < k) {
        alert("Мало точек для выбранного количества кластеров");
        return;
    }

    let centers = [];
    const usedIndexes = new Set();
    while (centers.length < k) {
        let index = Math.floor(Math.random() * points.length);
        if (!usedIndexes.has(index)) {
            usedIndexes.add(index);
            centers.push({ x: points[index].x, y: points[index].y });
        }
    }

    let changed = true;
    let iterations = 0;

    while (changed && iterations < 100){
        changed = false;
        iterations++;

        for (let p of points) {
            let minDist = Infinity;
            let closest = 0;
            for (let i = 0; i < centers.length; i++) {
                const dist = Math.hypot(p.x - centers[i].x, p.y - centers[i].y);
                if (dist < minDist) {
                    minDist = dist;
                    closest = i;
                }
            }
            if (p.cluster !== closest) {
                changed = true;
                p.cluster = closest;
            }
        }

        for (let i = 0; i < k; i++) {
            const clusterPoints = points.filter(p => p.cluster === i);
            if (clusterPoints.length > 0) {
                centers[i].x = clusterPoints.reduce((sum, p) => sum + p.x, 0) / clusterPoints.length;
                centers[i].y = clusterPoints.reduce((sum, p) => sum + p.y, 0) / clusterPoints.length;
            }
        }
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < points.length; i++) {
        drawPoint(points[i].x, points[i].y, colors[points[i].cluster]);
    }

    for (let i = 0; i < centers.length; i++) {
        drawPoint(centers[i].x, centers[i].y, colors[i], 10);
    }
}

function clearCanvas () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    points.length = 0;

}
