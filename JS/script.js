const userGameTable = $("#user-game-table");
const aiGameTable = $("#ai-game-table");
const restart = $("#restart").on("click", gameStartRestart);
const shipSizes = [1, 2, 2, 3, 4, 5];
const startButton = $("#start");
let horizontalOrVertical;
let userShips, aiShips;
let damagedAiShips;
let deadAiShips = [];
let damagedUserShips;
let deadUserShips = [];
let attackedTiles;
// Game Init / restart
function gameStartRestart() {
  deadAiShips = [];
  userShips = [];
  aiShips = [];
  attackedTiles = [];
  damagedAiShips = new Array(shipSizes.length).fill(new Array(0));
  damagedUserShips = new Array(shipSizes.length).fill(new Array(0));
  startButton.prop("disabled", false);
  userGameTable.unbind("click");
  aiGameTable.unbind("click");
  startButton.unbind("click");
  drawGameBoard("user");
  drawGameBoard("ai");
  horizontalOrVertical = 0.5;
  shipDealership("ai");
  horizontalOrVertical = $(".vertical-horizontal-slider").val() / 100;
  shipDealership("user");
  startButton.on("click", handleStartButton);
}

// Start button handler function
function handleStartButton() {
  startGamePlay();
}

// Start Game Play
function startGamePlay() {
  startButton.unbind("click");
  startButton.prop("disabled", true);
  userGameTable.on("click", "th", handleUserBoardClick);
  aiGameTable.on("click", "th", handleAiBoardClick);
}

// User Game Board Click Handler function
function handleUserBoardClick() {
  if (userShips) console.log("User tile# " + $(this).attr("id"));
  $(this).css("background-color", "green");
}
// Ai board click handler function
function handleAiBoardClick() {
  let clickedTile = parseInt($(this).attr("id").split("-")[1]);
  console.log("Clicked ID: ", clickedTile);

  for (let i = 0; i < aiShips.length; i++) {
    if (aiShips[i].includes(clickedTile)) {
      $(this).css("background-color", "red");
      $(this).prop("disabled", true);
      damagedAiShips[i] = damagedAiShips[i].concat(
        aiShips[i].splice(aiShips[i].indexOf(clickedTile), 1)
      );
      break;
    } else {
      $(this).prop("disabled", true);
      $(this).css("background-color", "black");
    }
  }

  // checking if the ship is dead
  for (let i = 0; i < aiShips.length; i++) {
    if (!aiShips[i].length) {
      damagedAiShips[i].forEach((el) => {
        $(`#ai-${el}`).css("background-color", "orange");
      });
      // checking if Game is Over
      if (!aiShips.join("").length) {
        userGameTable.unbind("click");
        aiGameTable.unbind("click");
        console.log("Game Over");
        return;
      }
      console.log(damagedAiShips[i], " is dead");
    }
  }
  console.log("User SHips: ", userShips);
  console.log("Ai SHips: ", aiShips);
  console.log("Damaged Ai SHips: ", damagedAiShips);
  console.log("Ai tile# " + $(this).attr("id"));
  counterAttack();
}
// AI Attacs user
function counterAttack() {
  console.log("---------COUNTER ATTACK---------");
  let attackCordinate = getValidAttackCordinates();
  attackedTiles.push(attackCordinate);

  let attackedTile = parseInt(
    $(`#user-${attackCordinate}`).attr("id").split("-")[1]
  );
  console.log("Attacked ID: ", attackedTile);

  for (let i = 0; i < userShips.length; i++) {
    if (userShips[i].includes(attackedTile)) {
      $(`#user-${attackCordinate}`).css("background-color", "red");
      $(`#user-${attackCordinate}`).prop("disabled", true);
      damagedUserShips[i] = damagedUserShips[i].concat(
        userShips[i].splice(userShips[i].indexOf(attackCordinate), 1)
      );
      break;
    } else {
      $(`#user-${attackCordinate}`).prop("disabled", true);
      $(`#user-${attackCordinate}`).css("background-color", "black");
    }
  }
  // checking if the ship is dead
  for (let i = 0; i < userShips.length; i++) {
    if (!userShips[i].length) {
      damagedUserShips[i].forEach((el) => {
        $(`#user-${el}`).css("background-color", "orange");
      });
      // checking if Game is Over
      if (!userShips.join("").length) {
        userGameTable.unbind("click");
        aiGameTable.unbind("click");
        console.log("Game Over");
        return;
      }
      console.log(damagedUserShips[i], " is dead");
    }
  }
  console.log(damagedUserShips);
  console.log("attackedTiles: ", attackedTiles);
}
// generate valid and smart attacs
const getValidAttackCordinates = () => {
  let attackCordinate;
  let valid = false;
  //   if (damagedUserShips)
  while (!valid) {
    attackCordinate = Math.floor(Math.random() * 100);
    if (!attackedTiles.includes(attackCordinate)) valid = true;
  }

  // Work here to implement AI

  return attackCordinate;
};

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
/**
 * @param {string} player
 * @return {array[array[]]} ships
 */
// generating battleships
function shipDealership(player) {
  let arrayOfShips;
  let randomLocation = null;
  let occupiedPositions = [];
  let isHorizontal;
  let containsTiles;
  let firstPosition;
  let touchingOthers;
  let suroundTouchArray = [];
  for (let i = 0; i < shipSizes.length; i++) {
    touchingOthers = true;
    console.log("inside Loop:i=", i);
    isHorizontal = Math.random() <= horizontalOrVertical;
    ship = [];
    // first 1X1 square placement
    if (i === 0) {
      arrayOfShips = [];
      firstPosition = shipFactory(shipSizes[0], false); // 100 is board array length
      arrayOfShips.push(firstPosition);
      occupiedPositions.push(firstPosition[0]);
      console.log("first position:", firstPosition[0]);
    } else {
      console.log("----------------------------------------------: ");
      randomLocation = shipFactory(shipSizes[i], isHorizontal);
      containsTiles = randomLocation.some((position) => {
        return occupiedPositions.includes(position);
      });
      //function to find if can place not overlaping
      while (touchingOthers || containsTiles) {
        suroundTouchArray = [];
        randomLocation = shipFactory(shipSizes[i], isHorizontal);

        containsTiles = occupiedPositions.some((position) => {
          return randomLocation.includes(position);
        });
        // Pushing all possible touching positins into array
        randomLocation.forEach((el) => {
          suroundTouchArray.push(el + 1, el - 1, el + 10, el - 10);
        });

        touchingOthers = occupiedPositions.some((el) => {
          return suroundTouchArray.includes(el);
        });
      }
      occupiedPositions = occupiedPositions.concat(randomLocation);
      arrayOfShips.push(randomLocation);
      console.log("occupiedPositions length", occupiedPositions.length);
      console.log("containsTiles: ", containsTiles);
    }
  }
  player === "user" ? (userShips = arrayOfShips) : (aiShips = arrayOfShips);
  colorizeShips(occupiedPositions, player);
  console.log("User Ships Army", userShips);
  console.log("Ai Ships Army", aiShips);
  console.log("occupiedPositions: ", occupiedPositions);
}

// To Generate random ships
const shipFactory = (shipSize, isHorizontal) => {
  let generatedShip = [];
  let horizontalShipArray = [];
  let verticalShipArray = [];
  let persistNumber = 0;
  let randomLocation = 0;
  // if generating vertical ships
  if (!isHorizontal) {
    for (let i = 0; i < 100 - (shipSize - 1) * 10; i++) {
      // adding all numbers except ship size that will hit bottom wall
      verticalShipArray.push(persistNumber);
      persistNumber++;
    }
    randomLocation =
      verticalShipArray[
        Math.floor(Math.random() * (100 - (shipSize - 1) * 10))
      ]; // -1 ??
    for (let i = 0; i < shipSize; i++) {
      generatedShip.push(randomLocation + i * 10);
    }
    return generatedShip;
  }
  // if generating horizontal ships
  if (isHorizontal) {
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        // adding all numbers except ship size that will hit bottom wall
        if (j <= 10 - shipSize) {
          horizontalShipArray.push(persistNumber);
        }
        persistNumber++;
      }
    }
    randomLocation =
      horizontalShipArray[Math.floor(Math.random() * (110 - shipSize * 10))]; // -1 ??
    for (let i = 0; i < shipSize; i++) {
      generatedShip.push(randomLocation + i);
    }
    return generatedShip;
  }
};
// Colorize oponent ships
const colorizeShips = (occupiedPositions, player) => {
  occupiedPositions.forEach((ship, i) => {
    $(`#${player}-${occupiedPositions[i]}`).css(
      "background-color",
      `${player === "user" ? "blue" : "white"}`
    );
  });
};

// Game Init
gameStartRestart();
