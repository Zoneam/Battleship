const userGameTable = $('#user-game-table');
const aiGameTable = $('#ai-game-table');
const generateShipsForUserButton = $('#generate-ships-for-user');
const restart = $('#restart').on('click', gameStart)
const shipSizes = [1, 2, 2, 3, 4, 5];
let moreHorizontalOrVertical = 0.5;
// const emptyGameArray = new Array(10).fill(new Array(10).fill('-'));

// Game Init / restart
function gameStart() {
    generateShipsForUserButton.prop("disabled", false);
    $("#start").prop("disabled", true);
    drawGameBoard('user');
    drawGameBoard('ai');
    generateShips('ai');
};


generateShipsForUserButton.on('click', function () {
    $("#start").prop("disabled", false);
    generateShips('user');
    
});

// Attach click event listeners

$("#start").one("click", function () {
    generateShipsForUserButton.prop("disabled", true);
    userGameTable.on('click', 'th', handleUserBoardClick);
    aiGameTable.on('click', 'th', handleAiBoardClick)
});

function handleUserBoardClick() {
    console.log("User tile# " + $(this).attr('id'));
    $(this).css('background-color','green');
};
    
function handleAiBoardClick() {
        console.log("Ai tile# " + $(this).attr('id'));
        $(this).css('background-color','black');
};

function drawGameBoard(player) {
    let gameBoard = '';
    let gameTable = $(`#${player}-game-table`);
    for (let i = 0; i < 10; i++) {
        gameBoard += `<tr class='' id="${player + '-' + 'row' + '-' + (i * 10)}"></tr>`;
        for(let j = 0; j < 10; j++) {
            gameBoard += `<th class='tg-0lax ripple' id="${player + '-' + (i * 10 + j)}"></th>`;
        };
    };
    gameTable.html(gameBoard)
};
// generating battleships
function generateShips(player){
    const arrayOfShips = [];
    let randomLocation = null;
    let occupiedPositions = [];
    let ship = [];
    let isHorizontal;
    let containsTiles;
    let firstPosition;
    let touchingOthers;
    let suroundCheckArray = [];
    for (let i = 0; i < shipSizes.length; i++) {
        touchingOthers = true;
        console.log("inside Loop:i=", i);
        isHorizontal = Math.random() <= moreHorizontalOrVertical;
        ship = [];
        // first 1X1 square placement
        if (i === 0) {
            firstPosition = generateShipAndPosition(shipSizes[0], false); // 100 is board array length
            ship.push(firstPosition);
            occupiedPositions.push(firstPosition[0]);
            console.log("first position:", firstPosition[0]);
        } else {
            console.log("----------------------------------------------: ")
            randomLocation = generateShipAndPosition(shipSizes[i], isHorizontal);
            containsTiles = randomLocation.some(position => {
                return occupiedPositions.includes(position);
            });
            //function to find if can place not overlaping
            while ((touchingOthers === true) || (containsTiles === true)) {
                suroundCheckArray = [];
                randomLocation = generateShipAndPosition(shipSizes[i], isHorizontal);
                
                containsTiles = occupiedPositions.some(position => {
                    return randomLocation.includes(position);
                });
                
                randomLocation.forEach(el => {
                    suroundCheckArray.push(el + 1, el - 1, el + 10, el - 10)
                });
               
                touchingOthers = occupiedPositions.some(el => {
                    return suroundCheckArray.includes(el);
                })
            };
            occupiedPositions = occupiedPositions.concat(randomLocation)
            ship.push(randomLocation);

            console.log("occupiedPositions length", occupiedPositions.length)
            console.log("occupiedPositions: ",occupiedPositions)
            console.log("randomLocation:   ", randomLocation)
            console.log("containsTiles: ", containsTiles)
            
        }; 
        arrayOfShips.push(ship);
    }
    colorizeShips(occupiedPositions,player);
    console.log("arrayOfShips",arrayOfShips);
    console.log("occupiedPositions Final: ",occupiedPositions)
};

// To Generate random ships
const generateShipAndPosition = (shipSize, isHorizontal) => {
    let generatedShip = [];
    let horizontalShipArray = [];
    let verticalShipArray = [];
    let persistNumber = 0;
    let randomLocation = 0;
    // if generating vertical ships
    if (!isHorizontal) {
        for (let i = 0; i < 100 - ((shipSize - 1) * 10); i++) {
            // adding all numbers except ship size that will hit bottom wall
            verticalShipArray.push((persistNumber));
            persistNumber++
        }
        randomLocation = verticalShipArray[Math.floor(Math.random() * (100 - ((shipSize - 1) * 10)))]; // -1 ??
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
                    horizontalShipArray.push((persistNumber));
                }
                persistNumber++
            }
        }
        randomLocation = horizontalShipArray[Math.floor(Math.random() * (110 - (shipSize * 10)))]; // -1 ??
        for (let i = 0; i < shipSize; i++) {
            generatedShip.push(randomLocation + i);
        }
        return generatedShip;
    }
};
// Colorize oponent ships
const colorizeShips = (occupiedPositions, player) => {
    occupiedPositions.forEach((ship, i) => {
        $(`#${player}-${occupiedPositions[i]}`).css('background-color', 'red');
    })
};
// Game Init
gameStart()