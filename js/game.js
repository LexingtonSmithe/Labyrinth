const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 200 }
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

const gridSize = 10;
const gridMap = generateGrid(gridSize);


function preload ()
{
    this.load.image('background', './assets/background.png');
    this.load.image('player', './assets/player.png');
    this.load.image('enemy', './assets/enemy.png');
    this.load.image('trap', './assets/trap.png');
    this.load.image('loot', './assets/loot.png');
    this.load.image('door', './assets/door.png');
    this.load.image('north button', './assets/northButton.png');
    this.load.image('south button', './assets/southButton.png');
    this.load.image('east button', './assets/eastButton.png');
    this.load.image('west button', './assets/westButton.png');

}

function create ()
{
    // UI
    this.add.image(400, 300, 'background');
    // TODO - MAKE THE DOORS ONLY APPEAR WHEN THERE IS A ROOM IN THAT DIRECTION TO MOVE TO
    this.add.image(400, 64, 'door');
    this.add.image(400, 380, 'door');
    this.add.image(64, 220, 'door');
    this.add.image(736, 220, 'door');
    //PLACEHOLDER
    // this.add.image(500, 220, 'player');
    // this.add.image(300, 220, 'enemy');
    //GUI
    const buttonNorth = this.add.sprite(150, 450, 'north button');
    buttonNorth.setInteractive();
    buttonNorth.on('pointerdown', () => moveToRoom('north'), this);

    const buttonSouth = this.add.image(150, 550, 'south button');
    buttonSouth.setInteractive();
    buttonSouth.on('pointerdown', () => moveToRoom('south'), this);

    const buttonEast = this.add.image(175, 500, 'east button');
    buttonEast.setInteractive();
    buttonEast.on('pointerdown', () => moveToRoom('east'), this);

    const buttonWest = this.add.image(125, 500, 'west button');
    buttonWest.setInteractive();
    buttonWest.on('pointerdown', () => moveToRoom('west'), this);

    // SETUP THE GAME

    populateGrid(gridMap, gridSize);

    // TEMP TO SEE WHERE ON THE CANVAS THINGS ARE.
    this.label = this.add.text(48, 48, '(x, y)', { fontFamily: '"Monospace"', fill: '#000000'});
    this.pointer = this.input.activePointer;

}

function update()
{
  this.label.setText('(' + this.pointer.x + ', ' + this.pointer.y + ')');

}

function moveToRoom(direction){
  console.log("Attempting to move... " + direction);

  let currentRoom = getActiveCell();
  console.log("Checking we've cleared the current room... " + currentRoom.cleared);

  if(currentRoom.cleared == true){
    // Change Room
    switch(direction){
      case 'north':
        if(checkGridBoundary(currentRoom.xpos, currentRoom.ypos - 1)){
            updateActiveCell(currentRoom.xpos, currentRoom.ypos - 1);
        } else{
          // Display message to player that they cannot go that way
        }
      break;

      case 'south':
        if(checkGridBoundary(currentRoom.xpos, currentRoom.ypos + 1)){
            updateActiveCell(currentRoom.xpos, currentRoom.ypos + 1);
        } else{
          // Display message to player that they cannot go that way
        }
      break;

      case 'east':
        if(checkGridBoundary(currentRoom.xpos + 1, currentRoom.ypos)){
            updateActiveCell(currentRoom.xpos + 1, currentRoom.ypos);
        } else{
          // Display message to player that they cannot go that way
        }
      break;

      case 'west':
        if(checkGridBoundary(currentRoom.xpos - 1, currentRoom.ypos)){
            updateActiveCell(currentRoom.xpos - 1, currentRoom.ypos);
        } else{
          // Display message to player that they cannot go that way
        }
      break;
    }
  } else {
    // Display a message to the player on why they can't move
    if(currentRoom.hasMonster == true){

    }

    if(currentRoom.hasTrap == true) {

    }

  }
}
function updateActiveCell(xpos, ypos){
  console.log("Attempting to update active cell")
  let oldCell = getActiveCell();
  gridMap[oldCell.xpos][oldCell.ypos].isActiveCell = false;

  gridMap[xpos][ypos].isActiveCell = true;

  // TODO: Below not required, just for testing
  let newCell = getActiveCell();
  console.log("Active Cell changed from: ["+ oldCell.xpos +"]["+ oldCell.ypos +"] ---> ["+ newCell.xpos +"]["+ newCell.ypos +"]")
  if(newCell.hasMonster){
    console.log("This room has a monster!");
  }
  if(newCell.hasTrap){
    console.log("This room is booby trapped");
  }
  if(newCell.hasLoot){
    console.log("This room has loot!");
  }
}

function getActiveCell(){
  for (let x = 0; x < gridSize; x++) {
    for (let y = 0; y < gridSize; y++) {
      let cell = gridMap[x][y];
      if (cell.isActiveCell) {
        return cell;
      }
    }
  }
}

function checkGridBoundary(xposToCheck, yposToCheck){
  console.log("Checking grid boundary");
  if(xposToCheck < 0 || yposToCheck < 0 || xposToCheck >= gridSize || yposToCheck >= gridSize){
    console.log("Player tried to move out of bounds")
    return false;
  } else {
    console.log("All good");
    return true;
  }
}

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
        hasLoot: false,
        hasTrap: false,
        cleared: true
      };
    }
  }
  grid[0][0].isActiveCell = true;
  return grid;
}
// Function to populate the grid with objects
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
}
