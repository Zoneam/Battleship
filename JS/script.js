const userGameTable = $('#user-game-table');
const aiGameTable = $('#ai-game-table');
const generateShipsForUserButton = $('#generate-ships-for-user');
const restart = $('#restart');
// const emptyGameArray = new Array(10).fill(new Array(10).fill('-'));
restart.on('click', function () {
    gameStart()
})

// Game Start
function gameStart() {



    drawGameBoard('user');
    drawGameBoard('ai');
    generateShips('ai');
    attachClickListenerUserGenerate();
}

const attachClickListenerUserGenerate = () => {
    generateShipsForUserButton.one('click', function () {
        generateShips('user');
    });
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


// Attach click event listeners
$("#start").one("click", function () {
    userGameTable.on('click', 'th', handleUserBoardClick);
    aiGameTable.on('click', 'th', handleAiBoardClick)
});

function handleUserBoardClick(e) {
    console.log("User tile# " + $(this).attr('id'));
    $(this).css('background-color','green');
};
    
function handleAiBoardClick() {
        console.log("Ai tile# " + $(this).attr('id'));
        $(this).css('background-color','black');
};

// generating battleships
function generateShips(player){
    const arrayOfShips = [];
    const shipSizes = [1, 2, 2, 3, 4, 5];
    let randomLocation = null;
    let occupiedPositions = [];
    let ship = [];
    let isHorizontal;
    let containsTiles;
    let firstPosition;
    for (let i = 0; i < shipSizes.length; i++) {
        console.log("inside Loop:i=", i)
        isHorizontal = Math.random() < 0.5;
        ship = [];
        // first 1X1 square placement
        if (i === 0) {
            firstPosition = generateShipAndPosition(shipSizes[0], false); // 100 is board array length
            ship.push(firstPosition);
            occupiedPositions.push(firstPosition[0]);
            console.log("first position:" , firstPosition[0])
        } else {
            randomLocation = generateShipAndPosition(shipSizes[i], isHorizontal);
            containsTiles = randomLocation.some(position => {
                return occupiedPositions.includes(position);
            });
            //function to find if can place not overlaping
            while (containsTiles) {
                randomLocation = generateShipAndPosition(shipSizes[i], isHorizontal);
                containsTiles = randomLocation.some(position => {
                    return occupiedPositions.includes(position);
                });
            }
                occupiedPositions = occupiedPositions.concat(randomLocation)
                ship.push(randomLocation);
                console.log("occupiedPositions length", occupiedPositions.length)
                console.log("occupiedPositions: ",occupiedPositions)
                console.log("randomLocation:   ", randomLocation)
                console.log("containsTiles: ", containsTiles)
        }
        arrayOfShips.push(ship);
    }
    colorizeShips(occupiedPositions,player);
    console.log("arrayOfShips",arrayOfShips);
    // console.log("occupiedPositions: ",occupiedPositions)
};

// To Generate random ships
const generateShipAndPosition = (shipSize, isHorizontal) => {
    console.log("isHorizontal: ", isHorizontal)
    let generatedShip = [];
    let horizontalShipArray = [];
    let verticalShipArray = [];
    let persistNumber = 0;
    let randomLocation = 0;
    console.log("--generating--")
    // if generating vertical ships
    if (!isHorizontal) {
        for (let i = 0; i < 100 - ((shipSize - 1) * 10); i++) {
            // adding all numbers except ship size that will hit bottom wall
            horizontalShipArray.push((persistNumber));
            persistNumber++
        }
        randomLocation = horizontalShipArray[Math.floor(Math.random() * (100 - ((shipSize - 1) * 10)))]; // -1 ??
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
const colorizeShips = (occupiedPositions,player) => {
    occupiedPositions.forEach((ship, i) => {
        $(`#${player}-${occupiedPositions[i]}`).css('background-color', 'red');
    })
};
// Game Init
gameStart()