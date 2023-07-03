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
const textLog = [];
const currentEncounter = {
    present: false,
    data: {}
};

const player = {
    health: 20,
    maxHealth: 20,
    healthPotions: 2,
    hasKey: false,
    inventory: [],
    roomsCleared: 0,
    monstersKilled: 0
}

var healthBar
var defaultText = "You have been thrown into the Labyrinth. You must battle your way through, find which monster has the key to your escape..."
var displayText = defaultText;
var encounterSprite;
var roomChange = true;
var fadeOverlay, overlay, messageText, replayButton;
var northDoor, southDoor, eastDoor, westDoor;
var totalMonsters;
var clearedRoomCounter = 0;


function preload ()
{
    // Basic
    this.load.image('background', './assets/background.png');
    this.load.image('overlay', './assets/overlay.png');
    this.load.image('textBox', './assets/textBox.png');
    this.load.image('player', './assets/player.png');
    this.load.image('door', './assets/door.png');
    this.load.image('button', './assets/button.png');
    this.load.image('exit unlocked', './assets/exitLadder.png');
    this.load.image('exit locked', './assets/exitKeyhole.png');
    this.load.image('health bar', './assets/healthbar.png');
    // GUI
    this.load.image('north button', './assets/buttonNorth.png');
    this.load.image('south button', './assets/buttonSouth.png');
    this.load.image('east button', './assets/buttonEast.png');
    this.load.image('west button', './assets/buttonWest.png');
    this.load.image('attack button', './assets/buttonAttack.png');
    this.load.image('heal button', './assets/buttonHeal.png');
    this.load.image('interact button', './assets/buttonInteract.png');
    this.load.image('info button', './assets/buttonInfo.png');
    // Monsters
    this.load.image('goblin', './assets/monsterGoblin.png');
    this.load.image('skeleton', './assets/monsterSkeleton.png');
    this.load.image('ooze', './assets/monsterOoze.png');
    this.load.image('troll', './assets/monsterTroll.png');
    // Traps
    this.load.image('spikes', './assets/trapSpikes.png');
    this.load.image('pit', './assets/trapPit.png');
    this.load.image('arrows', './assets/trapArrows.png');
    this.load.image('boulder', './assets/trapBoulder.png');
    // Loot
    this.load.image('coins', './assets/lootCoins.png');
    this.load.image('ring', './assets/lootRing.png');
    this.load.image('scepter', './assets/lootScepter.png');
    this.load.image('crown', './assets/lootCrown.png');
    this.load.image('key', './assets/lootKey.png');

}

function create ()
{
    // SETUP THE GAME

    populateGrid(gridMap, gridSize);
    totalMonsters = getNumberOfMonstersRemaining();

    // Static assets
    this.add.image(400, 300, 'background');
    this.add.image(625, 500, 'textBox');
    this.add.image(350, 550, 'health bar');
    this.add.image(500, 220, 'player');
    this.textBox = this.add.text(485, 435, "Testing...", {fontFamily: '"Monospace"', fill: '#000000', wordWrap: { width : 280, useAdvancedWrap : true }});

    createOverlay(this);
    createReplayButton(this);
    createMessageText(this);
    createFadeInOutOverlay(this);

    // Dynamic UI
    buttonSetup(this);
    healthBarSetup(this);

    // TEMP TO SEE WHERE ON THE CANVAS THINGS ARE.
    // this.label = this.add.text(48, 48, '(x, y)', { fontFamily: '"Monospace"', fill: '#000000'});
    // this.pointer = this.input.activePointer;

}

function update()
{

    //this.label.setText('(' + this.pointer.x + ', ' + this.pointer.y + ')');

    this.textBox.setText(displayText);
    healthBar.scaleX = (player.health / player.maxHealth);

    if (encounterSprite && encounterSprite.destroy) {
        encounterSprite.destroy();
    }
    if(currentEncounter.present){
        encounterSprite = this.add.sprite(300, 220, currentEncounter.data.spriteKey);
    }

    drawDoors(this);

}

function restartGame(){
    populateGrid(gridMap, gridSize);

    totalMonsters = getNumberOfMonstersRemaining();
    clearedRoomCounter = 0;
    roomChange = true;
    player.health = player.maxHealth
    player.healthPotions = 2
    player.hasKey = false
    player.inventory.splice(0);
    player.roomsCleared = 0;
    player.monstersKilled = 0;

    textLog.splice(0);
    displayText = defaultText;
    currentEncounter.present = false;
    currentEncounter.data = {};
}
