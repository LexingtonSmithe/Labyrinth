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
          if (randomValue < 0.5) {
                gridMap[x][y].hasMonster = true;
          } else if (randomValue < 0.7) {
                gridMap[x][y].hasLoot = true;
          } else {
                gridMap[x][y].hasTrap = true;
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


  let randX = randomInt(0, gridSize);
  let randY = randomInt(0, gridSize);

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
      cleared: true
  };

}

function checkGridBoundary(xposToCheck, yposToCheck){

    if(xposToCheck < 0 || yposToCheck < 0 || xposToCheck >= gridSize || yposToCheck >= gridSize){
        updateTextLog("You cannot go this way...");
        return false;
    } else {
        return true;
    }
}

function checkForPaths() {
  let room = getActiveCell();
  let paths = {
    north: false,
    south: false,
    east: false,
    west: false
  };

  // Check if there is a path in the north direction
  if (room.ypos > 0) {
    paths.north = true;
  }

  // Check if there is a path in the south direction
  if (room.ypos < gridSize - 1) {
    paths.south = true;
  }

  // Check if there is a path in the east direction
  if (room.xpos < gridSize - 1) {
    paths.east = true;
  }

  // Check if there is a path in the west direction
  if (room.xpos > 0) {
    paths.west = true;
  }

  return paths;
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
