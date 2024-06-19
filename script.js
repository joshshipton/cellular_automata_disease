class Disease {
    constructor(name, mortalityRatePercentage, infectionRatePercentage, recoveryTime) {
        this.name = name;
        this.mortalityRatePercentage = mortalityRatePercentage / 100;
        this.infectionRatePercentage = infectionRatePercentage / 100;
        this.recoveryTime = recoveryTime;
    }

    shouldInfect() {
        return Math.random() < this.infectionRatePercentage;
    }

    shouldDie() {
        return Math.random() < this.mortalityRatePercentage;
    }

    shouldRecover() {
        return Math.random() < (1 - this.mortalityRatePercentage);
    }
}

function createGrid(rows, cols) {
    const grid = new Array(rows);
    for (let i = 0; i < rows; i++) {
        grid[i] = new Array(cols).fill({ state: 'normal', daysInfected: 0 });
    }
    return grid;
}

function updateGrid(grid, disease) {
    const rows = grid.length;
    const cols = grid[0].length;
    const newGrid = createGrid(rows, cols);

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const cell = grid[i][j];
            const infectedNeighbors = countInfectedNeighbors(grid, i, j);
            if (cell.state === 'normal' && infectedNeighbors > 1 && disease.shouldInfect()) {
                newGrid[i][j] = { state: 'infected', daysInfected: 1 };
            } else if (cell.state === 'infected') {
                if (cell.daysInfected >= disease.recoveryTime) {
                    if (disease.shouldDie()) {
                        newGrid[i][j] = { state: 'dead', daysInfected: cell.daysInfected };
                    } else {
                        newGrid[i][j] = { state: 'recovered', daysInfected: cell.daysInfected };
                    }
                } else {
                    newGrid[i][j] = { state: 'infected', daysInfected: cell.daysInfected + 1 };
                }
            } else {
                newGrid[i][j] = cell;
            }
        }
    }
    return newGrid;
}

function countInfectedNeighbors(grid, x, y) {
    let count = 0;
    for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
            if (dx === 0 && dy === 0) continue;
            const nx = x + dx, ny = y + dy;
            if (nx >= 0 && nx < grid.length && ny >= 0 && ny < grid[0].length) {
                if (grid[nx][ny].state === 'infected') {
                    count++;
                }
            }
        }
    }
    return count;
}

function initializeGrid(grid, initialInfected) {
    for (let i = 0; i < initialInfected; i++) {
        const x = Math.floor(Math.random() * grid.length);
        const y = Math.floor(Math.random() * grid[0].length);
        grid[x][y] = { state: 'infected', daysInfected: 1 };
    }
}

function drawGrid(grid) {
    const gridContainer = document.getElementById('grid');
    gridContainer.innerHTML = '';
    grid.forEach(row => {
        row.forEach(cell => {
            const cellElement = document.createElement('div');
            cellElement.className = 'cell ' + cell.state;
            gridContainer.appendChild(cellElement);
        });
    });
}

function updateStats(grid) {
    let infected = 0, dead = 0, recovered = 0;
    grid.forEach(row => {
        row.forEach(cell => {
            if (cell.state === 'infected') infected++;
            if (cell.state === 'dead') dead++;
            if (cell.state === 'recovered') recovered++;
        });
    });
    document.getElementById('disease_infected_stat').textContent = `Infected: ${infected}`;
    document.getElementById('disease_killed_stat').textContent = `Killed: ${dead}`;
    document.getElementById('disease_recovered_stat').textContent = `Recovered: ${recovered}`;
}

let disease;
let grid = createGrid(75, 75);

drawGrid(grid);

document.getElementById('createBtn').addEventListener('click', () => {
    const infectionRate = parseInt(document.getElementById('rate_of_infection_input').value);
    const mortalityRate = parseInt(document.getElementById('mortaility_rate_input').value);
    const initialInfected = parseInt(document.getElementById('inital_infected_input').value);
    const recoveryTime = parseInt(document.getElementById('recovery_time_input').value);

    disease = new Disease("Example Disease", mortalityRate, infectionRate, recoveryTime);
    
    initializeGrid(grid, initialInfected);
    document.getElementById('disease_name_stat').textContent = `Disease Name: ${disease.name}`;

    simulate(grid, disease);
});

function simulate(grid, disease) {
    drawGrid(grid);
    updateStats(grid);
    setTimeout(() => {
        const newGrid = updateGrid(grid, disease);
        simulate(newGrid, disease);
    }, 100);
}

const gridContainer = document.getElementById('grid');
gridContainer.addEventListener('click', (event) => {
    const cell = event.target;
    const index = Array.prototype.indexOf.call(gridContainer.children, cell);
    const x = Math.floor(index / grid[0].length);
    const y = index % grid[0].length;
    grid[x][y] = grid[x][y].state === 'normal' ? { state: 'infected', daysInfected: 1 } : { state: 'normal', daysInfected: 0 };
    drawGrid(grid);
});
