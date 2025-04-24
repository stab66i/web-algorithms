let size = 20;
let grid = [];
let startCell = null;
let endCell = null;
const mazeContainer = document.getElementById("maze");

function generateMaze() {
    size = parseInt(document.getElementById("size").value);
    grid = [];
    mazeContainer.innerHTML = '';
    mazeContainer.style.gridTemplateColumns = `repeat(${size}, 20px)`;
    mazeContainer.style.gridTemplateRows = `repeat(${size}, 20px)`;

    for (let row = 0; row < size; row++) {
        const rowArr = [];
        for (let col = 0; col < size; col++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.dataset.row = row;
            cell.dataset.col = col;
            cell.addEventListener("click", () => toggleCell(cell));
            mazeContainer.appendChild(cell);
            rowArr.push({ element: cell, type: 'empty' });
        }
        grid.push(rowArr);
    }
    generatePrimMaze();
}

function toggleCell(cell) {
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);
    const cellObj = grid[row][col];

    if (cell.classList.contains("start")) {
        cell.classList.remove("start");
        startCell = null;
    } else if (cell.classList.contains("end")) {
        cell.classList.remove("end");
        endCell = null;
    } else if (cell.classList.contains("wall")) {
        cell.classList.remove("wall");
        cellObj.type = 'empty';
    } else if (!startCell) {
        cell.classList.add("start");
        startCell = cellObj;
        cellObj.type = 'start';
    } else if (!endCell) {
        cell.classList.add("end");
        endCell = cellObj;
        cellObj.type = 'end';
    } else {
        cell.classList.add("wall");
        cellObj.type = 'wall';
    }
}

function generatePrimMaze() {
    for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
            grid[row][col].element.classList.add("wall");
            grid[row][col].type = 'wall';
        }
    }

    const frontier = [];
    const mark = (row, col) => {
        if (row < 0 || col < 0 || row >= size || col >= size) return;
        if (grid[row][col].type === 'wall') {
            frontier.push([row, col]);
        }
    };

    const carve = (row, col) => {
        grid[row][col].element.classList.remove("wall");
        grid[row][col].type = 'empty';
        mark(row + 2, col);
        mark(row - 2, col);
        mark(row, col + 2);
        mark(row, col - 2);
    };

    let [sr, sc] = [1, 1];
    carve(sr, sc);
    while (frontier.length > 0) {
        const idx = Math.floor(Math.random() * frontier.length);
        const [row, col] = frontier.splice(idx, 1)[0];
        const neighbors = [];
        if (row >= 2 && grid[row - 2][col].type === 'empty') neighbors.push([row - 2, col]);
        if (row < size - 2 && grid[row + 2][col].type === 'empty') neighbors.push([row + 2, col]);
        if (col >= 2 && grid[row][col - 2].type === 'empty') neighbors.push([row, col - 2]);
        if (col < size - 2 && grid[row][col + 2].type === 'empty') neighbors.push([row, col + 2]);

        if (neighbors.length) {
            const [nr, nc] = neighbors[Math.floor(Math.random() * neighbors.length)];
            grid[row][col].element.classList.remove("wall");
            grid[row][col].type = 'empty';
            grid[(row + nr) / 2][(col + nc) / 2].element.classList.remove("wall");
            grid[(row + nr) / 2][(col + nc) / 2].type = 'empty';
            carve(row, col);
        }
    }
}

async function startPathfinding() {
    if (!startCell || !endCell) {
        showModal("Укажите начальную и конечную точки");
        return;
    }
    const queue = [[startCell]];
    const visited = new Set();

    while (queue.length > 0) {
        const path = queue.shift();
        const cell = path[path.length - 1];
        const row = parseInt(cell.element.dataset.row);
        const col = parseInt(cell.element.dataset.col);
        const key = `${row},${col}`;
        if (visited.has(key)) continue;
        visited.add(key);

        if (cell !== startCell && cell !== endCell){
            cell.element.classList.add("visited");
        }

        if (cell === endCell) {
            for (let i = 1; i < path.length - 1; i++) {
                const pathCell = path[i];
                if (pathCell !== startCell && pathCell !== endCell) {
                    pathCell.element.classList.add("path");
                }
            }
            return;
        }

        const directions = [
            [0, 1], [1, 0], [0, -1], [-1, 0]
        ];

        for (const [dr, dc] of directions) {
            const nr = row + dr, nc = col + dc;
            if (nr >= 0 && nc >= 0 && nr < size && nc < size) {
                const next = grid[nr][nc];
                if (!visited.has(`${nr},${nc}`) && next.type !== 'wall') {
                    queue.push([...path, next]);
                }
            }
        }
        await new Promise(r => setTimeout(r,7));
    }
    showModal("Путь не найден!");
}

function showModal(message) {
    let modal = document.getElementById("custom-modal");
    if (!modal) {
        modal = document.createElement("div");
        modal.id = "custom-modal";
        modal.innerHTML = `
      <div class="modal-content">
        <p id="modal-message"></p>
        <button onclick="document.getElementById('custom-modal').style.display='none'">окс</button>
      </div>`;
        document.body.appendChild(modal);
    }
    document.getElementById("modal-message").textContent = message;
    modal.style.display = "flex";
}
