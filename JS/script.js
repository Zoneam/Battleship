const { log } = console;
//********************************************* Variable Declarations *************************************************** */
const userGameTable = $("#user-game-table");
const aiGameTable = $("#ai-game-table");
const restart = $("#restart").on("click", gameStartRestart);
const startButton = $("#start");
const shipSizes = [1, 2, 2, 3, 4, 5];
let deadAiShips = [];
let deadUserShips = [];
let attackedPositions = [];
let damage = false;
let damagedShip = [];
let surroundTouchArray = [];
let userShips,
  aiShips,
  damagedAiShips,
  attackedTiles,
  damagedUserShips,
  horizontalOrVertical,
  foundShip,
  kill,
  kills,
  aiShipPositions,
  aiKills,
  killedShipsIndexes,
  attackArray,
  shot,
  betterAttackArray,
  deadShip,
  occupiedPositions;
//********************************************* Setting/Resetting Game Parameters to Initial State *************************************************** */
function gameStartRestart() {
  foundShip = [];
  surroundTouchArray = [];
  killedShipsIndexes = [];
  attackedPositions = [];
  deadAiShips = [];
  damagedShip = [];
  userShips = [];
  aiShips = [];
  attackedTiles = [];
  deadShip = [];
  aiHit = 0;
  aiKills = 0;
  aiShipPositions = [];
  kill = false;
  attackArray = [];
  damagedAiShips = new Array(shipSizes.length).fill(new Array(0));
  damagedUserShips = new Array(shipSizes.length).fill(new Array(0));
  startButton.prop("disabled", false);
  $("#game-over").text("");
  $("#game-over").removeClass("flipdown");
  $("#ai-kills").text("0");
  $("#hits").text("0");
  $("#kills").text("0");
  aiGameTable.unbind("click");
  startButton.unbind("click");
  drawGameBoard("user"); // drawing game board for User
  drawGameBoard("ai"); // drawing game board for AI
  horizontalOrVertical = 0.5;
  shipArmyGenerator("ai"); // Generating Battleship Army for AI
  horizontalOrVertical = $(".vertical-horizontal-slider").val() / 100;
  shipArmyGenerator("user"); // Generating Battleship Army for User
  startButton.on("click", startGamePlay);
}

//********************************************* Attaching Click Handler *************************************************** */
function startGamePlay() {
  startButton.unbind("click");
  startButton.prop("disabled", true);
  aiGameTable.on("click", "th", handleAiBoardClick);
}

//********************************************* USER ATTACK *************************************************** */
/**
 * @return {Number} attack position
 */
function handleAiBoardClick() {
  const clickedTile = parseInt($(this).attr('id').split('-')[1]);
  kills = 0;
  // Marking users attack position
  for (let i = 0; i < aiShips.length; i++) {
    if (aiShips[i].includes(clickedTile)) {
      $(this).text("X");
      $(this).addClass("hit");
      $(this).css("background-color", "#ff9900");
      $(this).prop("disabled", true);
      damagedAiShips[i] = damagedAiShips[i].concat(
        aiShips[i].splice(aiShips[i].indexOf(clickedTile), 1)
      );
      break;
    } else {
      $(this).addClass("hit");
      $(this).prop("disabled", true);
      $(this).css("background-color", "#808080");
    }
  }

  // Checking if the ship is dead and changing color for the whole ship
  damagedAiShips.forEach((damagedShip, index) => {
    if (aiShips[index].length === 0) {
      damagedShip.forEach(el => $(`#ai-${el}`).css('background-color', 'red'));
    }
  });

  // Counting and Updating Kills statistics
  kills = aiShips.reduce((count, ship) => count + (ship.length === 0 ? 1 : 0), 0);
  $('#kills').text(kills);

  // Checking if Game is Over
  if (!aiShips.flat().length) {
    aiGameTable.off('click');
    $('#game-over').addClass('flipdown').text('GAME OVER! YOU WON!');
    return;
  }
  // AI turn to attack
  counterAttack();
}

//********************************************* markSurroundingTiles *************************************************** */
function markSurroundingTiles(deadShip) {
  deadShip.forEach(position => {
    let top = position - 10;
    let bottom = position + 10;
    let left = position % 10 === 0 ? null : position - 1;
    let right = position % 10 === 9 ? null : position + 1;

    [top, bottom, left, right].forEach((direction) => {
      if (direction !== null && !surroundTouchArray.includes(direction)) {
        surroundTouchArray.push(direction);
      }
    });
  });
}

//********************************************* COUNTER ATTACK *************************************************** */
/**
 * @return {Number} attack position
 */
function counterAttack() {
  let valid = false;
  let randomPos;
  // If we dont have attack positions but have damaged ship
  if (attackArray.length === 0 || damage) {
    if (damage) {
      if (shot % 10 === 0 && shot !== 0 && shot !== 90) {
        attackArray.push(shot + 1, shot + 10, shot - 10);
      } else if (shot < 9 && shot !== 0) {
        attackArray.push(shot + 1, shot - 1, shot + 10);
      } else if (shot > 90 && shot !== 99) {
        attackArray.push(shot + 1, shot - 1, shot - 10);
      } else if ((shot + 1) % 10 === 0 && shot !== 99 && shot !== 9) {
        attackArray.push(shot - 1, shot + 10, shot - 10);
      } else if (shot === 0) {
        attackArray.push(shot + 1, shot + 10);
      } else if (shot === 90) {
        attackArray.push(shot + 1, shot - 10);
      } else if (shot === 99) {
        attackArray.push(shot - 1, shot - 10);
      } else if (shot === 9) {
        attackArray.push(shot - 1, shot + 10);
      } else {
        attackArray.push(shot - 1, shot + 1, shot + 10, shot - 10);
      }
    } else {
      damagedShip = [];
      attackArray = [Math.floor(Math.random() * 100)];
    }
    attackArray = attackArray.filter((el) => {
      return !attackedPositions.includes(el) && !surroundTouchArray.includes(el);
    });

    if (!attackArray.length) {
      while (!valid) {
        randomPos = Math.floor(Math.random() * 100);
        if (!surroundTouchArray.includes(randomPos) && !attackedPositions.includes(randomPos)) {
          attackArray = [randomPos];
          valid = true;
          damagedShip = [];
        }
      }
    }
  }
  // If we have attack array and we have damaged ship
  // Filtering unnecessary positions
  if (attackArray.length && damage) {
    betterAttackArray = [];
    if (damagedShip.length >= 2) {
      if (Math.abs(damagedShip[1] - damagedShip[0]) === 10) {
        //is vertical
        attackArray = attackArray.filter((el) => {
          return el % 10 === damagedShip[0] % 10;
        });
      }
      if (Math.abs(damagedShip[1] - damagedShip[0]) === 1) {
        // check for horizontal
        attackArray = attackArray.filter((el) => {
          return Math.abs(el - damagedShip[0]) < 8;
        });
      }
    }
  }
  // If no available shooting tiles generate random
  valid = false;
  if (!attackArray.length) {
    while (!valid) {
      randomPos = Math.floor(Math.random() * 100);
      if (!surroundTouchArray.includes(randomPos)  && !attackedPositions.includes(randomPos)) {
        attackArray = [randomPos];
        valid = true;
        damagedShip = [];
      }
    }
  }
  shot = attackArray[attackArray.length - 1];
  attackedPositions = attackedPositions.concat(attackArray.pop());
  // Coloring tiles
  if (occupiedPositions.includes(shot)) {
    $(`#user-${Number(shot)}`).text("X");
    $(`#user-${Number(shot)}`).addClass("hit");
    $(`#user-${Number(shot)}`).css("background-color", "#ff9900");
    $(`#user-${Number(shot)}`).prop("disabled", true);
    damage = true;
    damagedShip.push(shot);
  } else {
    $(`#user-${Number(shot)}`).css("background-color", "#808080");
    $(`#user-${Number(shot)}`).addClass("hit");
    $(`#user-${Number(shot)}`).prop("disabled", true);
    damage = false;
  }
  // Check for kill
  userShips.forEach((el, i) => {
    if (el.every((pos) => attackedPositions.includes(pos))) {
      deadShip = userShips[i];
      markSurroundingTiles(deadShip);
      attackArray = [];
      damage=false;
      userShips.splice(i, 1);
    }
  });
  if (deadShip.length) {
    deadShip.forEach((el) => {
      $(`#user-${el}`).css("background-color", "red");
      $(`#user-${el}`).prop("disabled", true);
    });
  }
  // Counting Kills
  $("#ai-kills").text(6 - userShips.length);
  $("#hits").text(attackedPositions.length);
  // checking if Game is Over
  if (!userShips.join("").length) {
    aiGameTable.unbind("click");
    $("#game-over").addClass("flipdown");
    $("#game-over").text("GAME OVER! YOU LOSE!");
    // Reveal Ai Array when Ai wins
    aiShips.flat().forEach((el) => {
      $(`#${"ai"}-${el}`).addClass("grow");
    });
    return;
  }
}
//********************************************* Generating Playing Boards *************************************************** */
/**
 * @param {string} player
 * @return {table} gameBoard
 */
function drawGameBoard(player) {
  let gameBoard = "";
  let gameTable = $(`#${player}-game-table`);
  for (let i = 0; i < 10; i++) {
    gameBoard += `<tr class='' id="${
      player + "-" + "row" + "-" + i * 10
    }"></tr>`;
    for (let j = 0; j < 10; j++) {
      gameBoard += `<th class='tg-0lax ripple' id="${
        player + "-" + (i * 10 + j)
      }"></th>`;
    }
  }
  gameTable.html(gameBoard);
}
//********************************************* Generating Battleships *************************************************** */
/**
 * @param {string} player
 * @return {array[array[]]} ships
 */
const shipArmyGenerator = (player) => {
  occupiedPositions = [];
  let arrayOfShips = shipSizes.map((shipSize, index) => {
    let ship;
    // First 1x1 square placement
    if (index === 0) {
      ship = shipFactory(shipSize, false); // 100 is board array length
      occupiedPositions.push(ship[0]);
    } else {
      let containsTiles, touchingOthers;
      let randomLocation, suroundTouchArray;
      // Function to find if can place not overlapping
      do {
        let isHorizontal = Math.random() <= horizontalOrVertical;
        randomLocation = shipFactory(shipSize, isHorizontal);
        containsTiles = randomLocation.some(position => occupiedPositions.includes(position));
        // Pushing all possible touching positions into array
        suroundTouchArray = randomLocation.flatMap(el => [el + 1, el - 1, el + 10, el - 10]);
        touchingOthers = occupiedPositions.some(el => suroundTouchArray.includes(el));
      } while (touchingOthers || containsTiles);
      
      occupiedPositions = [...occupiedPositions, ...randomLocation];
      ship = randomLocation;
    }
    
    return ship;
  });

  if (player === "user") {
    userShips = arrayOfShips;
  } else {
    aiShips = arrayOfShips;
  }
  colorizeShips(occupiedPositions, player);
};


//********************************************* Generating Individual Battleships *************************************************** */
/**
 * @param {String} shipSize
 * @param {Boolean} isHorizontal
 * @return {Array} generatedShip
 */
const shipFactory = (shipSize, isHorizontal) => {
  let persistNumber = 0;
  let randomLocation = 0;
  
  if (!isHorizontal) { // generating vertical ships
    const verticalShipArray = Array.from({length: 100 - (shipSize - 1) * 10}, () => persistNumber++);
    randomLocation = verticalShipArray[Math.floor(Math.random() * verticalShipArray.length)];
    
    return Array.from({length: shipSize}, (_, i) => randomLocation + i * 10);
  }
  if (isHorizontal) { // generating horizontal ships
    const horizontalShipArray = Array.from({length: 10 * 10})
      .map(() => persistNumber++)
      .filter((_, i) => i % 10 <= 10 - shipSize);
      
    randomLocation = horizontalShipArray[Math.floor(Math.random() * horizontalShipArray.length)];
    return Array.from({length: shipSize}, (_, i) => randomLocation + i);
  }
};


//********************************************* Ship Painting facility *************************************************** */
/**
 * @param {Array} shipSize
 * @param {Streeng} player
 */
const colorizeShips = (occupiedPositions, player) => {
  occupiedPositions.forEach((ship, i) => {
    $(`#${player}-${occupiedPositions[i]}`).css(
      "background-color",
      `${player === "user" ? "blue" : "ffefdb"}`
    );
  });
};

//********************************************* Game Initialization *************************************************** */
gameStartRestart();