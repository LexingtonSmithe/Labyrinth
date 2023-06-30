function generateGrid(gridSize) {
    // Generate an empty grid
    let grid = [];
    for (let x = 0; x < gridSize; x++) {
        grid[x] = [];
        for (let y = 0; y < gridSize; y++) {
            grid[x][y] = {
            xpos: x,
            ypos: y,
            isActiveCell: false,
            isExit: false,
            hasMonster: false,
            monster: {},
            hasLoot: false,
            loot: {},
            hasTrap: false,
            trap:{},
            cleared: false
            };
        }
    }
    return grid;
}

function populateGrid(grid, gridSize) {

    for (let x = 0; x < gridSize; x++) {
        for (let y = 0; y < gridSize; y++) {

          // Randomly assign game items to the cell
          let randomValue = Math.random();
          if (randomValue < 0.33) {
                gridMap[x][y].hasMonster = true; // 33% chance of having a monster
          } else if (randomValue < 0.66) {
                gridMap[x][y].hasLoot = true; // 33% chance of having loot
          } else {
                gridMap[x][y].hasTrap = true; // 34% chance of having a trap
          }
        }
    }
  // Set the start point
    grid[0][0] = {
        xpos: 0,
        ypos: 0,
        isActiveCell: true,
        isExit: false,
        hasMonster: false,
        monster: {},
        hasLoot: false,
        loot: {},
        hasTrap: false,
        trap:{},
        cleared: true
    };

  // TODO: Set the goal
  let randX = randomInt(0, gridSize)
  let randY = randomInt(0, gridSize)
  grid[randX][randY] = {
      xpos: randX,
      ypos: randY,
      isActiveCell: false,
      isExit: true,
      hasMonster: false,
      monster: {},
      hasLoot: false,
      loot: {},
      hasTrap: false,
      trap:{},
      cleared: false
  };
}

function checkGridBoundary(xposToCheck, yposToCheck){
    console.log("Checking grid boundary");
    if(xposToCheck < 0 || yposToCheck < 0 || xposToCheck >= gridSize || yposToCheck >= gridSize){
        updateTextLog("You cannot go this way...");
        console.log("Player tried to move out of bounds")
        return false;
    } else {
        console.log("All good");
        return true;
    }
}

function getNumberOfMonstersRemaining(){
    let monsters = 0;
    for (let x = 0; x < gridSize; x++) {
        for (let y = 0; y < gridSize; y++) {
          let cell = gridMap[x][y];
          if (cell.hasMonster) {
            monsters ++
          }
        }
    }
    return monsters
}

function calculateKeyDropChance(){
    let monsters = getNumberOfMonstersRemaining();
    let chance = 0.2; // Initial chance starts at 20%

    if (monsters > 0) {
      // Increase chance for each monster slain
      chance += (1 - chance) * (1 - monsters / totalMonsters);
    } else {
      chance = 1; // 100% chance if no monsters remaining
    }
    
    return Math.random() < chance;
}
