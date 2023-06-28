

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

function updateTextLog(text){

  if(textLog.length > 6) {
    textLog.push(text);
    textLog.shift();
  }

  if(textLog.length <= 6){
    textLog.push(text)
  }
  // TODO: Make this so it doesn't display undefined
  displayText = textLog.filter(Boolean).join("\n");
}


function randomInt(min, max) {
  // Ensure min is rounded down and max is rounded up
  min = Math.floor(min);
  max = Math.ceil(max);

  // Generate a random number within the range (inclusive of min and max)
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function chooseFromArray(array){
  let randomIndex = Math.floor(Math.random() * array.length)
  return array[randomIndex];
}
