function createGrid(rows, cols) {
    const grid = new Array(rows);
    for (let i = 0; i < rows; i++) {
        grid[i] = new Array(cols).fill('normal');
    }
    return grid;
}

const grid = createGrid(10, 10);  // Example: 10x10 grid

function updateGrid(grid) {
    const rows = grid.length;
    const cols = grid[0].length;
    const newGrid = createGrid(rows, cols); // Create a new grid for the next state

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const cell = grid[i][j];
            // Apply rules based on neighbors and current state
            // Example rule: infection spread
            const infectedNeighbors = countInfectedNeighbors(grid, i, j);
            if (cell === 'normal' && infectedNeighbors > 1) {
                newGrid[i][j] = 'infected';
            } else {
                newGrid[i][j] = grid[i][j];
            }
        }
    }
    return newGrid;
}

function countInfectedNeighbors(grid, x, y) {
    let count = 0;
    for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
            if (dx === 0 && dy === 0) continue; // Skip the current cell itself
            const nx = x + dx, ny = y + dy;
            if (nx >= 0 && nx < grid.length && ny >= 0 && ny < grid[0].length) {
                if (grid[nx][ny] === 'infected') {
                    count++;
                }
            }
        }
    }
    return count;
}



function drawGrid(grid) {
    const gridContainer = document.getElementById('grid');
    gridContainer.innerHTML = ''; // Clear previous cells
    grid.forEach(row => {
        row.forEach(cellState => {
            const cell = document.createElement('div');
            cell.className = 'cell ' + cellState;
            gridContainer.appendChild(cell);
        });
    });
}


// flood fill
async function fill(grid, x, y, target, replacement) {
    // sleep for 100ms
    await new Promise(r => setTimeout(r, 100));
    if (x < 0 || x >= grid.length || y < 0 || y >= grid[0].length) return;
    if (grid[x][y] !== target) return;
    grid[x][y] = "infected";
    drawGrid(grid); 
    fill(grid, x + 1, y, target, replacement);
    fill(grid, x - 1, y, target, replacement);
    fill(grid, x, y + 1, target, replacement);
    fill(grid, x, y - 1, target, replacement);
}

fill(grid, 0, 0, 100, 200);
drawGrid(grid); 

