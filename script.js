class Disease {
    constructor(name, mortalityRatePercentage, infectionRatePercentage, recoveryTime, chanceOfImmunity, lengthOfImmunity) {
        this.name = name;
        this.mortalityRatePercentage = mortalityRatePercentage / 100;
        this.infectionRatePercentage = infectionRatePercentage / 100;
        this.recoveryTime = recoveryTime;
        this.chanceOfImmunity = chanceOfImmunity / 100;
        this.lengthOfImmunity = lengthOfImmunity;
    }


    shouldInfect(infectedNeighbors) {
        // take into account infected neighbors, make it an exponential function
        const baseRate = this.infectionRatePercentage;
        const adjustedRate = 1 - Math.pow((1 - baseRate), infectedNeighbors);
        return Math.random() < adjustedRate;
    }


    shouldDie() {
        return Math.random() < this.mortalityRatePercentage;
    }

    shouldRecover() {
        return Math.random() < (1 - this.mortalityRatePercentage);
    }

    shouldGetImmunity() {
        return Math.random() < this.chanceOfImmunity;
    }

    shouldLoseImmunity(daysImmune) {
        return daysImmune >= this.lengthOfImmunity;
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
            // if it's normal and should be infected, infect
            if ((cell.state === 'normal' || cell.state === "recovered") && infectedNeighbors > 1 && disease.shouldInfect(infectedNeighbors)) {
                // set daysInfected to 1
                newGrid[i][j] = { state: 'infected', daysInfected: 1 };
                // if its infected, check if it should recover or die or get immunity
            } else if (cell.state === 'infected') {
                // if it's been infected for the recovery time, recover
                if (cell.daysInfected >= disease.recoveryTime) {
                    // Check if should recover or die
                    if (disease.shouldDie()) {
                        newGrid[i][j] = { state: 'dead', daysInfected: cell.daysInfected };

                    } else { // Should recover
                        // Check if should be immune 
                        if (disease.shouldGetImmunity()) {

                            // make it Immune, set days immune to 1
                            newGrid[i][j] = { state: 'immune', daysImmune : 1, daysInfected: 0};
                        } else {
                            // recover without Immunity
                            newGrid[i][j] = { state: 'recovered', daysInfected: 0 };
                        }
                    }
                } else {
                    newGrid[i][j] = { state: 'infected', daysInfected: cell.daysInfected + 1 };
                }
            } else if (cell.state === 'immune') {
                console.log("cell is immune");
                console.log(cell.daysInfected);
                // change it to take into account the length of imunity not the length of infection
                if (disease.shouldLoseImmunity(cell.daysImmune)) {
                    newGrid[i][j] = { state: 'recovered', daysInfected: 0 };
                } else {
                    // increment days immune
                    cell.daysImmune++;
                }
            }
            else {
                newGrid[i][j] = cell;
            }
        }
    }
    return newGrid;
}

// This is gonna change eventually to calculate the number of infected neighbors and then calculate the probability of infection from there 
// Will have to be some sort of diminish return thing idk, wouldn't be linear
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
            if (cell.state === 'recovered' || cell.state == "immune") recovered++;
        });
    });
    document.getElementById("days_passed").textContent = `Day: ${days++}`;
    document.getElementById('disease_infected_stat').textContent = `Infected: ${infected}`;
    document.getElementById('disease_killed_stat').textContent = `Killed: ${dead}`;
    document.getElementById('disease_recovered_stat').textContent = `Recovered: ${recovered}`;
    document.getElementById('total_simulated_people').textContent = `Total: ${grid.length * grid[0].length}`;
}

let disease;
let days = 1;
let grid = createGrid(75, 75);

drawGrid(grid);

document.getElementById('createBtn').addEventListener('click', () => {
    const infectionRate = parseInt(document.getElementById('rate_of_infection_input').value);
    const mortalityRate = parseInt(document.getElementById('mortaility_rate_input').value);
    const initialInfected = parseInt(document.getElementById('inital_infected_input').value);
    const recoveryTime = parseInt(document.getElementById('recovery_time_input').value);
    const chanceOfImmunity = parseInt(document.getElementById('chance_of_immunity_input').value);
    const lengthOfImmunity = parseInt(document.getElementById('length_of_immunity_input').value);

    disease = new Disease("Example Disease", mortalityRate, infectionRate, recoveryTime, chanceOfImmunity, lengthOfImmunity);

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

// Click to Infect
// const gridContainer = document.getElementById('grid');
// gridContainer.addEventListener('click', (event) => {
//     const cell = event.target;
//     const index = Array.prototype.indexOf.call(gridContainer.children, cell);
//     const x = Math.floor(index / grid[0].length);
//     const y = index % grid[0].length;
//     grid[x][y] = grid[x][y].state === 'normal' ? { state: 'infected', daysInfected: 1 } : { state: 'normal', daysInfected: 0 };
//     drawGrid(grid);
// });
