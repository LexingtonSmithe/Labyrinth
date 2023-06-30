function buttonSetup(scene){
    const buttonNorth = scene.add.sprite(150, 450, 'north button');
    buttonNorth.setInteractive();
    buttonNorth.on('pointerdown', () => moveToRoom('North', scene), this);

    const buttonSouth = scene.add.image(150, 550, 'south button');
    buttonSouth.setInteractive();
    buttonSouth.on('pointerdown', () => moveToRoom('South', scene), this);

    const buttonEast = scene.add.image(175, 500, 'east button');
    buttonEast.setInteractive();
    buttonEast.on('pointerdown', () => moveToRoom('East', scene), this);

    const buttonWest = scene.add.image(125, 500, 'west button');
    buttonWest.setInteractive();
    buttonWest.on('pointerdown', () => moveToRoom('West', scene), this);

    const buttonAttack = scene.add.image(275, 500, 'attack button');
    buttonAttack.setInteractive();
    buttonAttack.on('pointerdown', () => attackMonster(), this);

    const buttonInteract = scene.add.image(325, 500, 'interact button');
    buttonInteract.setInteractive();
    buttonInteract.on('pointerdown', () => interactAction(), this);

    const buttonHeal = scene.add.image(375, 500, 'heal button');
    buttonHeal.setInteractive();
    buttonHeal.on('pointerdown', () => drinkHealthPotion(), this);
}

function healthBarSetup(scene){

    healthBar = scene.add.graphics();
    healthBar.fillStyle(0xe74c3c, 1);
    healthBar.fillRect(0, 0, 192, 31);
    healthBar.x = 254;
    healthBar.y = 534;

}

function drawDoors(scene) {
    if(roomChange == true){
        let paths = checkForPaths();
        console.log(paths);
        // NORTH
        if (northDoor && northDoor.destroy) {
            northDoor.destroy();
        }
        if (paths.north) {
            northDoor = scene.add.sprite(400, 66, 'door');
        }

        // SOUTH
        if (southDoor && southDoor.destroy) {
            southDoor.destroy();
        }
        if (paths.south) {
            southDoor = scene.add.sprite(400, 383, 'door');
            southDoor.setAngle(180);
        }

        // EAST
        if (eastDoor && eastDoor.destroy) {
            eastDoor.destroy();
        }
        if (paths.east) {
            eastDoor = scene.add.sprite(734, 220, 'door');
            eastDoor.setAngle(90);
        }

        // WEST
        if (westDoor && westDoor.destroy) {
            westDoor.destroy();
        }
        if (paths.west) {
            westDoor = scene.add.sprite(66, 220, 'door');
            westDoor.setAngle(-90);
        }
        roomChange = false
    }
}

function fadeOutIn(scene) {
  return new Promise((resolve) => {
    // Fade out effect
    scene.tweens.add({
      targets: fadeOverlay,
      alpha: 1,
      duration: 500,
      onComplete: () => {
        // Perform actions after fade out (e.g., move player to the new room)

        // Fade in effect
        scene.tweens.add({
          targets: fadeOverlay,
          alpha: 0,
          duration: 500,
          onComplete: () => {
            // Perform actions after fade in (e.g., display the new room)
            resolve(); // Resolve the promise when the fade effect is complete
          },
        });
      },
    });
  });
}
