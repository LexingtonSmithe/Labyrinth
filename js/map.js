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
    hasMonster: false,
    monster: {},
    hasLoot: false,
    loot: {},
    hasTrap: false,
    trap:{},
    cleared: true
  };

  // TODO: Set the goal
  // grid[?][?]
  // grid[?][?]
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
