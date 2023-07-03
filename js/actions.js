
/// Movement
function moveToRoom(direction, scene){

    let currentRoom = getActiveCell();

    if(currentRoom.cleared == true){
    // Change Room
        switch(direction){

            case 'North':
                if(checkGridBoundary(currentRoom.xpos, currentRoom.ypos - 1)){
                    updateTextLog("You venture North...");
                    fadeOutIn(scene).then(()=>{
                        updateActiveCell(currentRoom.xpos, currentRoom.ypos - 1);
                        roomChange = true;
                    })
                }
            break;

            case 'South':
                if(checkGridBoundary(currentRoom.xpos, currentRoom.ypos + 1)){
                    updateTextLog("You venture South...");
                    fadeOutIn(scene).then(()=>{
                        updateActiveCell(currentRoom.xpos, currentRoom.ypos + 1);
                        roomChange = true;
                    })
                }
            break;

            case 'East':
                if(checkGridBoundary(currentRoom.xpos + 1, currentRoom.ypos)){
                    updateTextLog("You venture East...");
                    fadeOutIn(scene).then(()=>{
                        updateActiveCell(currentRoom.xpos + 1, currentRoom.ypos);
                        roomChange = true;
                    })
                }
            break;

            case 'West':
                if(checkGridBoundary(currentRoom.xpos - 1, currentRoom.ypos)){
                    updateTextLog("You venture West...");
                    fadeOutIn(scene).then(()=>{
                        updateActiveCell(currentRoom.xpos - 1, currentRoom.ypos);
                        roomChange = true;
                    })
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
        if(currentRoom.hasLoot == true) {
            updateTextLog("You don't want to leave this loot behind!.");
        }
    }
}

function updateActiveCell(xpos, ypos){

    let oldCell = getActiveCell();
    gridMap[oldCell.xpos][oldCell.ypos].isActiveCell = false;
    gridMap[xpos][ypos].isActiveCell = true;
    //console.log("Active Cell changed from: ["+ oldCell.xpos +"]["+ oldCell.ypos +"] ---> ["+ xpos +"]["+ ypos +"]");
    checkNewActiveCell();

}

function checkNewActiveCell(){

    let cell = getActiveCell();

    if(cell.hasMonster){

        let monster = chooseFromArray(monsterArray);
        gridMap[cell.xpos][cell.ypos].monster = monster;
        updateTextLog("You've encountered a monster!");
        updateCurrentEncounter(monster);

    }

    if(cell.hasTrap){

        let trap = chooseFromArray(trapArray)
        gridMap[cell.xpos][cell.ypos].trap = trap;
        updateTextLog("This room is booby trapped!");
        updateCurrentEncounter(trap);

    }

    if(cell.hasLoot){

        let loot = chooseFromArray(lootArray);
        gridMap[cell.xpos][cell.ypos].loot = loot;
        updateTextLog("This room has loot!");
        updateCurrentEncounter(loot);

    }

    if(cell.isExit){

        updateTextLog("You've found the exit, have you found the key?");
        updateCurrentEncounter({spriteKey: 'exit locked'});

    }

    if(cell.cleared){
        updateTextLog("You think you've seen this room before...");
        if(clearedRoomCounter > 2){
            updateTextLog("You think you've seen this room before...");
            clearedRoomCounter = 0;
        } else {
            clearedRoomCounter ++;
        }
    }

}

function updateCurrentEncounter(encounter){

    currentEncounter.present = !!encounter;
    currentEncounter.data = encounter || {};

}

/// Actions
function attackMonster(){

    let room = getActiveCell();

    if(room.hasMonster){

        let playerDamage = randomInt(3,5);
        let monsterDamage = randomInt(1, room.monster.attack);
        let monsterHealth = gridMap[room.xpos][room.ypos].monster.health

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
                showGameOver();
            }

        } else {

            gridMap[room.xpos][room.ypos].hasMonster = false;
            updateTextLog("You attack the monster for " + playerDamage + " damage");
            updateTextLog("The creature is dead!");
            gridMap[room.xpos][room.ypos].cleared = true;
            gridMap[room.xpos][room.ypos].monster = {};
            player.roomsCleared ++;
            player.monstersKilled ++;
            updateCurrentEncounter()
            monsterLootDrops(room);

        }

    } else {

        updateTextLog("You can't attack anything in here...");

    }
}

function drinkHealthPotion(){
    if(player.health > 0){
        if(player.healthPotions > 0){

            player.health = player.maxHealth;
            player.healthPotions --;
            updateTextLog("You drank a health potion.");

        } else {

            updateTextLog("You don't have any more potions.");

        }

    } else {
        updateTextLog("It's a bit late for that...");
    }

}

function interactAction(){

    let room = getActiveCell();

    if(room.hasLoot){

        if(room.loot.name == 'key'){

            player.hasKey = true
            gridMap[room.xpos][room.ypos].hasLoot = false;
            gridMap[room.xpos][room.ypos].loot = {};
            gridMap[room.xpos][room.ypos].cleared = true;
            player.roomsCleared ++;
            updateTextLog("You found a key now to find the exit");
            updateCurrentEncounter();
        } else {

            player.inventory.push(room.loot);
            updateTextLog("You found a " + room.loot.name + " worth " + room.loot.worth + "gp");
            updateCurrentEncounter();
            gridMap[room.xpos][room.ypos].hasLoot = false;
            gridMap[room.xpos][room.ypos].loot = {};
            gridMap[room.xpos][room.ypos].cleared = true;
            player.roomsCleared ++;

        }
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

            if(player.health > trapDamage){

                player.health -= trapDamage;

            } else {

                player.health = 0;
                updateTextLog("You are dead...");
                showGameOver();

            }

        }

        updateCurrentEncounter();
        gridMap[room.xpos][room.ypos].hasTrap = false;
        gridMap[room.xpos][room.ypos].trap = {};
        gridMap[room.xpos][room.ypos].cleared = true;
        player.roomsCleared ++;

    } else if(room.isExit){

        if(player.hasKey){

            updateTextLog("You've unlocked the exit!");
            gridMap[room.xpos][room.ypos].cleared = true;
            player.roomsCleared ++;
            updateCurrentEncounter({spriteKey: 'exit unlocked'});

        } else {

            updateTextLog("You must find the key to escape.");

        }

        if(room.cleared){

            updateTextLog("You make your way up the ladder to freedom");
            updateTextLog("You found " + calculatePlayerLootValue() + "gp worth of loot");
            showGameCompleted();

        }

    } else {

        updateTextLog("You can't touch anything in here...");

    }

}

function printCurrentInfo(){

    let cleared = player.roomsCleared;
    let monstersKilled = player.monstersKilled;
    let potions = player.healthPotions;
    let health = player.health;
    let loot = calculatePlayerLootValue();


    updateTextLog("You have slain " + monstersKilled + " monsters");
    updateTextLog("You have explored " + cleared + " rooms");
    updateTextLog("You have " + loot + "gp of loot");
    if(player.hasKey){
        updateTextLog("You have found the key to the exit");
    } else {
        updateTextLog("You haven't found the key to the exit");
    }
    updateTextLog("You have " + health + " health remaining");
    updateTextLog("You have " + potions + " health potions remaining");


}


/// Action utils
function monsterLootDrops(room){

    if(!player.hasKey) {

        if(calculateKeyDropChance()){

            let key = {
                name: 'key',
                spriteKey: 'key'
            }
            gridMap[room.xpos][room.ypos].hasLoot = true;
            gridMap[room.xpos][room.ypos].loot = key;
            updateTextLog("The monster dropped the key!");
            updateCurrentEncounter(key);

        } else {

            chooseLoot();

        }

    } else {

        chooseLoot();

    }

}

function chooseLoot(){

    let room = getActiveCell();

    if(randomInt(1, 100) < 25){ // 25% chance of loot

        let loot = chooseFromArray(lootArray);
        gridMap[room.xpos][room.ypos].loot = loot;
        gridMap[room.xpos][room.ypos].hasLoot = true;
        updateTextLog("The monster dropped loot!");
        updateCurrentEncounter(loot);

    }

}

function calculatePlayerLootValue(){

    let totalValue = 0;

    for(let i=0; i < player.inventory.length; i++ ){
        totalValue += player.inventory[i].worth;
    }

    //console.log("Loot: " + totalValue + "gp");

    return totalValue;
}
