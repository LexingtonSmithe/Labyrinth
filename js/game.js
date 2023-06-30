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
var healthBar, northDoor, southDoor, eastDoor, westDoor;
var displayText = "You have found yourself in a Labyrinth of my design. You must battle your way out to find which monster has the key to your escape..."

const currentEncounter = {
    present: false,
    data: {}
};
var encounterSprite;
var totalMonsters;


const player = {
    health: 10,
    maxHealth: 10,
    healthPotions: 2,
    hasKey: false,
    inventory: []
}

function preload ()
{
    // Basic
    this.load.image('background', './assets/background.png');
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
    // Monsters
    this.load.image('goblin', './assets/monsterGoblin.png');
    this.load.image('skeleton', './assets/monsterSkeleton.png');
    this.load.image('ooze', './assets/monsterSkeleton.png');
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
    // Static UI
    this.add.image(400, 300, 'background');
    this.add.image(625, 500, 'textBox');
    this.add.image(350, 550, 'health bar');

    healthBar = this.add.graphics();
    healthBar.fillStyle(0xe74c3c, 1);
    healthBar.fillRect(0, 0, 192, 31);
    healthBar.x = 254;
    healthBar.y = 534;

    //this.add.image(625, 500, 'button');
    //this.input.setDefaultCursor('url(assets/input/cursors/blue.cur), pointer');

    // TODO - MAKE THE DOORS ONLY APPEAR WHEN THERE IS A ROOM IN THAT DIRECTION TO MOVE TO
    // Placeholder
    northDoor = this.add.image(400, 66, 'door');
    southDoor = this.add.image(400, 383, 'door');
	southDoor.setAngle(180);
	eastDoor = this.add.image(734, 220, 'door');
	eastDoor.setAngle(90);
	westDoor = this.add.image(66, 220, 'door');
	westDoor.setAngle(-90)

    this.add.image(500, 220, 'player');

    // Interactive UI
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

    const buttonAttack = this.add.image(275, 500, 'attack button');
    buttonAttack.setInteractive();
    buttonAttack.on('pointerdown', () => attackMonster(), this);

    const buttonHeal = this.add.image(325, 500, 'heal button');
    buttonHeal.setInteractive();
    buttonHeal.on('pointerdown', () => drinkHealthPotion(), this);

    const buttonInteract = this.add.image(375, 500, 'interact button');
    buttonInteract.setInteractive();
    buttonInteract.on('pointerdown', () => interactAction(), this);
    // SETUP THE GAME

    populateGrid(gridMap, gridSize);
    totalMonsters = getNumberOfMonstersRemaining();


    this.textBox = this.add.text(485, 435, "Testing...", {fontFamily: '"Monospace"', fill: '#000000', wordWrap: { width : 280, useAdvancedWrap : true }});
    // TEMP TO SEE WHERE ON THE CANVAS THINGS ARE.
    this.label = this.add.text(48, 48, '(x, y)', { fontFamily: '"Monospace"', fill: '#000000'});

    this.pointer = this.input.activePointer;

}

function update()
{

    this.label.setText('(' + this.pointer.x + ', ' + this.pointer.y + ')');

    this.textBox.setText(displayText);

    if (encounterSprite && encounterSprite.destroy) {
        encounterSprite.destroy();
    }
    if(currentEncounter.present){
        console.log(currentEncounter);
        encounterSprite = this.add.sprite(300, 220, currentEncounter.data.spriteKey);
    }

    drawDoors()

    healthBar.scaleX = (player.health*10) / 100

}


function drawDoors() {
	// TODO: Make it so the doors are only drawn when the player can move in that direction

}
