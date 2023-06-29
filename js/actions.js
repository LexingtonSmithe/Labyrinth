function moveToRoom(direction){
    console.log("Attempting to move... " + direction);

    let currentRoom = getActiveCell();
    console.log("Checking we've cleared the current room... " + currentRoom.cleared);

    if(currentRoom.cleared == true){
    // Change Room
        switch(direction){
        case 'north':
            if(checkGridBoundary(currentRoom.xpos, currentRoom.ypos - 1)){
            updateTextLog("You venture North...");
            updateActiveCell(currentRoom.xpos, currentRoom.ypos - 1);
            } else{
                // Display message to player that they cannot go that way
            }
        break;

        case 'south':
            if(checkGridBoundary(currentRoom.xpos, currentRoom.ypos + 1)){
                updateTextLog("You venture South...");
                updateActiveCell(currentRoom.xpos, currentRoom.ypos + 1);
            } else {
                // Display message to player that they cannot go that way
            }
        break;

        case 'east':
            if(checkGridBoundary(currentRoom.xpos + 1, currentRoom.ypos)){
                updateTextLog("You venture East...");
                updateActiveCell(currentRoom.xpos + 1, currentRoom.ypos);
            } else {
                // Display message to player that they cannot go that way
            }
        break;

        case 'west':
            if(checkGridBoundary(currentRoom.xpos - 1, currentRoom.ypos)){
                updateTextLog("You venture West...");
                updateActiveCell(currentRoom.xpos - 1, currentRoom.ypos);
            } else {
                // Display message to player that they cannot go that way
            }
        break;
        }
    } else {
        if(currentRoom.hasMonster == true){
            updateTextLog("You cannot flee, you must face the monster!");
        }
        if(currentRoom.hasTrap == true) {
            updateTextLog("You cannot see a way around, you must disarm the trap.");
        }
    }
}

function updateActiveCell(xpos, ypos){
    console.log("Attempting to update active cell")
    let oldCell = getActiveCell();
    gridMap[oldCell.xpos][oldCell.ypos].isActiveCell = false;
    gridMap[xpos][ypos].isActiveCell = true;
    console.log("Active Cell changed from: ["+ oldCell.xpos +"]["+ oldCell.ypos +"] ---> ["+ xpos +"]["+ ypos +"]");
    checkNewActiveCell();
}

function checkNewActiveCell(){
    let cell = getActiveCell();
    console.log("Checking room for goodies...");

    if(cell.hasMonster){
        let monster = chooseFromArray(monsterArray);
        gridMap[cell.xpos][cell.ypos].monster = monster;
        updateTextLog("You've encountered a monster!");
        updateCurrentEncounter(monster);
        console.log("This room has a monster!");
    }
    if(cell.hasTrap){
        let trap = chooseFromArray(trapArray)
        gridMap[cell.xpos][cell.ypos].trap = trap;
        updateTextLog("This room is booby trapped!");
        updateCurrentEncounter(trap);
        console.log("This room is booby trapped");
    }
    if(cell.hasLoot){
        let loot = chooseFromArray(lootArray);
        gridMap[cell.xpos][cell.ypos].loot = loot;
        updateTextLog("This room has loot!");
        updateCurrentEncounter(loot);
        console.log("This room has loot!");
    }
}

function updateCurrentEncounter(encounter){
    currentEncounter.present = !!encounter;
    currentEncounter.data = encounter || {};
}


function attackMonster(){
    let room = getActiveCell();
    if(room.hasMonster){
        let playerDamage = randomInt(3,5);
        let monsterDamage = randomInt(1, room.monster.attack);
        let monsterHealth = gridMap[room.xpos][room.ypos].monster.health

        console.log("Player Damage " + playerDamage);
        console.log("Player Health " + player.health);
        console.log("Monster Damage " + monsterDamage);
        console.log("Monster Health " + monsterHealth);

        if(monsterHealth > playerDamage){

            gridMap[room.xpos][room.ypos].monster.health -= playerDamage;
            updateTextLog("You attack the monster for " + playerDamage + " damage");

            if(player.health > monsterDamage){
                player.health -= monsterDamage;
                updateTextLog("The monster attacks you for " + monsterDamage + " damage");
            } else {
                player.health = 0;
                updateTextLog("The monster attacks you for " + monsterDamage + " damage");
                updateTextLog("You are dead...")
                // TODO: Create a way to restart the game presenting the stats to the player of their run
            }
        } else {
            gridMap[room.xpos][room.ypos].hasMonster = false;
            updateTextLog("You attack the monster for " + playerDamage + " damage");
            updateTextLog("The creature is dead!");
            if(randomInt(1, 100) < 25){ // 25% chance of loot
                let loot = chooseFromArray(lootArray);
                gridMap[room.xpos][room.ypos].loot = loot;
                gridMap[room.xpos][room.ypos].hasLoot = true;
                updateTextLog("The monster dropped loot!");
                updateCurrentEncounter(loot);
            } else {
                updateCurrentEncounter();
                gridMap[room.xpos][room.ypos].cleared = true;
                gridMap[room.xpos][room.ypos].monster = {};
            }
        }
    } else {
        updateTextLog("You can't attack anything in here...");
    }
}

function drinkHealthPotion(){
    if(player.healthPotions > 0){
        player.health = player.maxHealth;
        player.healthPotions --;
        updateTextLog("You drank a health potion.");
    } else {
        updateTextLog("You don't have any more potions.");
    }
}

function interactAction(){

    let room = getActiveCell();
    if(room.hasLoot){
        updateTextLog("You found a " + room.loot.name + " worth " + room.loot.worth + "gp");
        updateCurrentEncounter();
        gridMap[room.xpos][room.ypos].hasLoot = false;
        gridMap[room.xpos][room.ypos].loot = {};
        gridMap[room.xpos][room.ypos].cleared = true;
    } else if(room.hasTrap){

        updateTextLog("Attempting to disarm the trap");
        let trapDamage = randomInt(2, room.trap.damage_on_failure)

        if(randomInt(0,100) < room.trap.chance_to_disarm){
            updateTextLog("You successfully disarm the trap");
        } else {
            updateTextLog("Oh no you've triggered the trap!");
            switch(room.trap.name){
                case("Spike Trap"):
                    updateTextLog("Spikes impale you for " + trapDamage + " damage");
                break;
                case("Pit Trap"):
                    updateTextLog("You fell in the pit taking " + trapDamage + " damage");
                break;
                case("Arrow Trap"):
                    updateTextLog("Arrows fly at you, take " + trapDamage + " damage");
                break;
                case("Boulder Trap"):
                    updateTextLog("A Boulder crushes you for " + trapDamage + " damage");
                break;
            }
            player.health -= trapDamage;
        }
        updateCurrentEncounter();
        gridMap[room.xpos][room.ypos].hasTrap = false;
        gridMap[room.xpos][room.ypos].trap = {};
        gridMap[room.xpos][room.ypos].cleared = true;
    } else {
        updateTextLog("You can't touch anything in here...");
    }
}