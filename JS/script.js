const userGameTable = $("#user-game-table");
const aiGameTable = $("#ai-game-table");
const restart = $("#restart").on("click", gameStartRestart);
const startButton = $("#start");
const shipSizes = [1, 2, 2, 3, 4, 5];
let userShips, aiShips,
  damagedAiShips,
  attackedTiles,
  damagedUserShips,
  horizontalOrVertical, 
  foundShip, kill, kills, aiShipPositions,aiKills,
  killedShipsIndexes, attackArray, shot,betterAttackArray, deadShip, occupiedPositions;
let deadAiShips = [];
let deadUserShips = [];
let attackedPositions = [];
let damage = false;
let damagedShip = []

// Start button handler function
function handleStartButton() {
  startGamePlay();
}
// Game Init / restart
function gameStartRestart() {
  foundShip = [];
  killedShipsIndexes =[];
  attackedPositions = [];
  deadAiShips = [];
  damagedShip = [];
  userShips = [];
  aiShips = [];
  attackedTiles = [];
  deadShip=[];
  aiHit = 0;
  aiKills = 0;
  aiShipPositions = [];
  kill = false;
  attackArray = [];
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
  kills = 0;
  console.log("Clicked ID: ", clickedTile);

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

  // checking if the ship is dead
  for (let i = 0; i < aiShips.length; i++) {
    if (!aiShips[i].length) {
      damagedAiShips[i].forEach((el) => {
        console.log("coloring");
        $(`#ai-${el}`).css("background-color", "red");
      });
      console.log(damagedAiShips[i], " is dead");
    }
  }
  // Counting Kills
  aiShips.forEach(el =>{
    if (!el.length){
      kills++
    }
  })
  $('#kills').text(kills)

  // checking if Game is Over
  if (!aiShips.join("").length) {
    userGameTable.unbind("click");
    aiGameTable.unbind("click");
    console.log("Game Over User Won the Game");
    return;
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
  let valid = false;
  let randomPos;

  if (!attackArray.length || damage){
    if (damage) {
        if (shot % 10 === 0 && shot !== 0 && shot !==90) {
          attackArray.push(shot + 1, shot + 10, shot - 10)
        } else if(shot < 9 && shot !== 0) {
          attackArray.push(shot + 1, shot - 1, shot + 10)
        } else if (shot > 90 && shot !== 99) {
          attackArray.push(shot + 1, shot - 1, shot - 10)
        } else if ((shot + 1) % 10 === 0 && shot !== 99 && shot !== 9) {
          attackArray.push(shot - 1, shot + 10, shot - 10)
        } else if (shot === 0) {
          attackArray.push(shot + 1, shot + 10)
        } else if(shot === 90) {
          attackArray.push(shot + 1, shot - 10)
        } else if (shot === 99) {
          attackArray.push(shot - 1, shot - 10)
        } else if (shot === 9) {
          attackArray.push(shot - 1, shot + 10)
        } else {
          attackArray.push(shot - 1, shot + 1, shot + 10, shot - 10)
        }
    } else {
      damagedShip = [];
          attackArray = [Math.floor(Math.random() * 100)];
          console.log("Surounding possible array",attackArray);
        }
        attackArray = attackArray.filter(el => {
            return !attackedPositions.includes(el)
        })
    console.log("Attack Array-----------------------",attackArray)
    if (!attackArray.length) {
      console.log(attackArray, "+++++++++++++++" )
      while (!valid) {
        console.log("inside while")
        randomPos = Math.floor(Math.random() * 100);
        if (!attackedPositions.includes(randomPos)) {
          attackArray = [randomPos];
          valid = true;
          damagedShip = [];
        }
      }
    }
  }
  if (attackArray.length && damage) {
    betterAttackArray = [];
    console.log("damagedShip9999999999999999999999999999", damagedShip)
    if (damagedShip.length >= 2) {
      console.log("damagedShip***********************", damagedShip)
      if (Math.abs(damagedShip[1] - damagedShip[0]) === 10) { //is vertical
        console.log("vertical", damagedShip)
        attackArray = attackArray.filter(el => {
          console.log("el[el.length - 1]", el % 10)
          console.log("damagedShip[0][damagedShip.length - 1]", damagedShip[0] % 10)
            return el % 10 === damagedShip[0] % 10
        })

        
      }
      console.log("betterAttackArray", attackArray)
      if (Math.abs(damagedShip[1] - damagedShip[0]) === 1) { // check for horizontal
        console.log("verticHorizontalal", damagedShip)
        attackArray = attackArray.filter(el => {
          console.log( el )
          console.log( damagedShip[0])
          return (Math.abs(el - damagedShip[0]) < 8);
        })
      }
    }
  }

// if no available shooting tiles generate random
   valid = false;
  if (!attackArray.length) {
    while (!valid) {
      console.log("inside while")
      randomPos = Math.floor(Math.random() * 100);
      if (!attackedPositions.includes(randomPos)) {
        attackArray = [randomPos];
        valid = true;
        damagedShip = [];
      }
    }
  }

  shot = attackArray[attackArray.length - 1];
  console.log("attackArray",attackArray);
  attackedPositions = attackedPositions.concat(attackArray.pop());

  // coloring tiles
  if(occupiedPositions.includes(shot)){
    $(`#user-${Number(shot)}`).text("X")
    $(`#user-${Number(shot)}`).addClass("hit");
    $(`#user-${Number(shot)}`).css("background-color", "#ff9900");
    $(`#user-${Number(shot)}`).prop("disabled", true);
    damage = true;
    damagedShip.push(shot)
    console.log("hit")
  } else {

    $(`#user-${Number(shot)}`).css("background-color", "#808080");
    $(`#user-${Number(shot)}`).addClass("hit");
    $(`#user-${Number(shot)}`).prop("disabled", true);
    damage = false;
  }

// check for kill
  userShips.forEach((el,i) => {
    if(el.every(pos => attackedPositions.includes(pos))){
      console.log("Im Here", userShips[i]);
      deadShip = userShips[i];
      userShips.splice(i, 1);
    }
  })
console.log("deadShip",deadShip);
  if (deadShip.length){
    deadShip.forEach(el => {
      $(`#user-${el}`).css("background-color", "red");
      $(`#user-${el}`).prop("disabled", true);
    })
  }

  console.log(deadShip);
  
  console.log("Attacked Positions",attackedPositions);

  // Counting Kills
  $("#ai-kills").text(6 - userShips.length)
  $('#hits').text(attackedPositions.length)
// checking if Game is Over
console.log("AI SHIIIIIIP",aiShips)
if (!userShips.join("").length) {
  userGameTable.unbind("click");
  aiGameTable.unbind("click");
  console.log("Game Over AI Won the Game");
  // Reveal Ai Array when Ai wins
  aiShips.flat().forEach(el=>{
    $(`#${"ai"}-${el}`).addClass('grow');
    // $(`#${"ai"}-${el}`).css('background', 'url("./images/github.png")')
    // $(`#${"ai"}-${el}`).css("background-color", "#38d7ff");
  })
  return;
}

}
//************************************************************************************************ */

function drawGameBoard(player) {
  let gameBoard = "";
  let gameTable = $(`#${player}-game-table`);
  for (let i = 0; i < 10; i++) {
    gameBoard += `<tr class='' id="${
      player + "-" + "row" + "-" + i * 10
    }"></tr>`;
    for (let j = 0; j < 10; j++) {
      gameBoard += `<th class='tg-0lax ripple' style="font-size: 30px" id="${
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
  occupiedPositions = [];
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
      ]; 
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
      horizontalShipArray[Math.floor(Math.random() * (110 - shipSize * 10))]; 
    for (let i = 0; i < shipSize; i++) {
      generatedShip.push(randomLocation + i);
    }
    
    return generatedShip;
  }
};
// Colorize oponent ships
const colorizeShips = (occupiedPositions, player) => {
  occupiedPositions.forEach((ship, i) => {
    $(`#${player}-${occupiedPositions[i]}`).css("background-color",`${player === "user" ? "blue" : "ffefdb"}`);
  });
};

// Game Init
gameStartRestart();
