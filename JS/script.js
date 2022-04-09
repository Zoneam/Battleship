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
    const shipSizes = [1, 2, 3, 3, 4, 5];
    let randomLocation = null;
    const occupiedPositions = [];
    let foundShip = false;
    let ship = [];
    let isVertical;
// console.log(randomPlacementPosition())
// console.log(Math.floor(randomPlacementPosition / 10), randomPlacementPosition % 10);
// $(`#ai-${randomPlacementPosition}`).css('background-color', 'red');
    

    for (let i = 0; i < shipSizes.length; i++) {
        console.log("-----------------------------------------")
        console.log("inside Loop:i=", i)
        isVertical = Math.random() < 0.5;
        ship = [];
        // first 1X1 square placement
        if (i === 0) {
            let firstPosition = randomPlacementPosition(shipSizes[0], false); // 100 is board array length
            ship.push(firstPosition);
            occupiedPositions.push(firstPosition);
            console.log("first position:" , firstPosition)
        } else {
            console.log("shipSize: ",shipSizes[i])
            console.log("inside else:")
            do {
                for (let j = 0; j < shipSizes[i]; j++) {
                        console.log("shipSizes",shipSizes[i])
                        console.log("while")
                        console.log("j = ", j)
                        console.log("isVertical = ", isVertical)
                        // random location where our new ship can be placed away from walls
                        randomLocation = randomPlacementPosition(shipSizes[i], isVertical);
                        //searching for horizontal ships
                        console.log("randomLocation", randomLocation)
                    // if (!occupiedPositions.includes(randomLocation) && !isVertical) {
                        //function to find if can place not overlaping
                        console.log("inside if:----")
                        // for (let y = 0; y < shipSizes[i]; y++){
                            // if (!occupiedPositions.includes(randomLocation + y)) {
                                occupiedPositions.push(randomLocation) //??
                                ship.push(randomLocation);//??
                            // }
                        // }
                        // }
                    }
            } while (ship.length < shipSizes[i] )
         
        console.log("times", i)

        }

        arrayOfShips.push(ship);
    }
    colorizeShips(arrayOfShips);
    console.log("arrayOfShips",arrayOfShips);
    console.log("occupiedPositions: ",occupiedPositions)
}

const colorizeShips = (arrayOfShips) => {
    arrayOfShips.forEach((ship, i) => {
        ship.forEach((shipEL, j) => {
            $(`#ai-${arrayOfShips[i][j]}`).css('background-color', 'red');
        })
    })
}


const randomPlacementPosition = (shipSize, isVertical) => {
    let randomNumber = 0;
    let horizontalAvailableNumbersArray = [];
    let persistNumber = 0;
    if (!isVertical) {
        randomNumber = Math.floor(Math.random() * (100 - shipSize - 1));
        return randomNumber;
    }
    if (isVertical) {
        for (i = 0; i < 10; i++) {
            for (j = 0; j < 10; j++) {
                // adding all numbers except ship size that will hit right wall
                if (j <= 10 - shipSize) {
                    horizontalAvailableNumbersArray.push((persistNumber));
                }
                persistNumber++
            }
        }
        randomNumber = horizontalAvailableNumbersArray[ Math.floor(Math.random() * (100 - (shipSize * 10)))];
        return randomNumber;
    }
    
    
}


generateShips()