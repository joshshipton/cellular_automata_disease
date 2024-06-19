
//  create the grid
function createGrid(rows, cols) {
    const grid = new Array(rows);
    for (let i = 0; i < rows; i++) {
        grid[i] = new Array(cols).fill('normal');
    }
    return grid;
}
const grid = createGrid(25, 25);  


// update grid based on disease spread
function updateGrid(grid) {
    const rows = grid.length;
    const cols = grid[0].length;
    const newGrid = createGrid(rows, cols); 

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
    // Loop through all 8 neighbors
    for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
            if (dx === 0 && dy === 0) continue; 
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
    // deletes the old grid for the new one
    gridContainer.innerHTML = '';
    grid.forEach(row => {
        row.forEach(cellState => {
            const cell = document.createElement('div');
            cell.className = 'cell ' + cellState;
            gridContainer.appendChild(cell);
        });
    });
}

// // flood fill 
async function fill(grid, x, y,) {
    // check that we are in bounds
    console.log("checking at ", x, y)
    if (x < 0 || x >= grid.length || y < 0 || y >= grid[0].length) return;
    if (grid[x][y] == "infected") return;

    // change color
    console.log("changing color at", x, y)
    grid[x][y] = "infected";

    // wait for 100ms
    await new Promise(resolve => setTimeout(resolve, 100));

    // recursively fill in all directions
    fill(grid, x + 1, y);
    fill(grid, x - 1, y);
    fill(grid, x, y + 1);
    fill(grid, x, y - 1);

    // draw the grid
    drawGrid(grid); 
}

drawGrid(grid);
fill(grid, 0, 0);

