const userGameTable = $('#user-game-table');
const aiGameTable = $('#ai-game-table');
const emptyGameArray = new Array(10).fill(new Array(10).fill('-'));
console.log(emptyGameArray);

function generateGameBoard(player) {
    for(let i = 0; i < 10; i++) {
        $(`#${player}-game-table`).append(`<tr class='' id="${player + '-' + 'row' + '-' + (i * 10)}"></tr>`);
        for(let j = 0; j < 10; j++) {
            $("tr").last().append(`<th class='tg-0lax' id="${player + '-' + (i * 10 + j)}"></th>`);
        };
    };
};
generateGameBoard('user');
generateGameBoard('ai');

// Attach click event listeners
$("#start").one("click", function(){
    userGameTable.on('click', 'th', function() {
        console.log("User tile# " + $(this).attr('id'));
        $(this).css('background-color','green');
    });

    aiGameTable.on('click', 'th', function() {
        console.log("Ai tile# " + $(this).attr('id'));
        $(this).css('background-color','red');
    });
})

//----------------------------------------------------------------
// generating battleships
function generateShips(){
    const arrayOfShips = [];
    const shipSizes = [1, 2, 2, 3, 4, 5];
    let randomLocation = null;
    let occupiedPositions = [];
    let foundShip = false;
    let ship = [];
    let isHorizontal;
    let containsTiles = false;
    for (let i = 0; i < shipSizes.length; i++) {
        console.log("-----------------------------------------")
        console.log("inside Loop:i=", i)
        isHorizontal = Math.random() < 0.5;
        ship = [];
        // first 1X1 square placement
        if (i === 0) {
            let firstPosition = generateShipAndPosition(shipSizes[0], false); // 100 is board array length
            ship.push(firstPosition);
            occupiedPositions.push(firstPosition[0]);
            console.log("first position:" , firstPosition[0])
        } else {
                
                // ship array comes back from our ship generator
            randomLocation = generateShipAndPosition(shipSizes[i], isHorizontal);
            containsTiles = randomLocation.some(position => {
                return occupiedPositions.includes(position);
            });
                console.log("randomLocation:   ",randomLocation)
                console.log("containsTiles: ", containsTiles)
            if (!containsTiles) {
                    //function to find if can place not overlaping
                occupiedPositions = occupiedPositions.concat(randomLocation)
                ship.push(randomLocation);
            }



        }
        arrayOfShips.push(ship);
    }
    colorizeShips(occupiedPositions);
    console.log("arrayOfShips",arrayOfShips);
    console.log("occupiedPositions: ",occupiedPositions)
}

const colorizeShips = (occupiedPositions) => {
    occupiedPositions.forEach((ship, i) => {
            $(`#ai-${occupiedPositions[i]}`).css('background-color', 'red');
    })
}


const generateShipAndPosition = (shipSize, isHorizontal) => {
    console.log("isHorizontal: ",isHorizontal)
    let generatedShip = [];
    let horizontalShipArray = [];
    let verticalShipArray = [];
    let persistNumber = 0;
    let randomLocation = 0;
    console.log("Ship SZ:", shipSize)
    console.log("-----------generating--------------")
    // generating horizontal ships
    if (!isHorizontal) {
        console.log("verticalShipArray", verticalShipArray)
        for (let i = 0; i < 100 - ((shipSize-1) * 10) ; i++) {
                // adding all numbers except ship size that will hit bottom wall
                horizontalShipArray.push((persistNumber));
                persistNumber++
        }
        console.log("horizontalShipArray", horizontalShipArray)
        randomLocation = horizontalShipArray[Math.floor(Math.random() * (100 - (shipSize * 10)))]; // -1 ??
        for (let i = 0; i < shipSize; i++){
            generatedShip.push(randomLocation + i * 10);
        }
        return generatedShip;
    }

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
        console.log("horizontalShipArray", horizontalShipArray)
        randomLocation = horizontalShipArray[Math.floor(Math.random() * (100 - (shipSize * 10)))]; // -1 ??
        for (let i = 0; i < shipSize; i++){
            generatedShip.push(randomLocation + i);
        }
        return generatedShip;
    }
}


generateShips()