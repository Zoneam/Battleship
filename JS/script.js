const userGameTable = $('#user-game-table');
const aiGameTable = $('#ai-game-table');
const emptyGameArray = new Array(10).fill(new Array(10).fill('-'));
console.log(emptyGameArray);

function generateGameBoard(player) {
    for(i = 0; i < 10; i++) {
        $(`#${player}-game-table`).append(`<tr class='' id="${player + '-' + 'row' + '-' + (i * 10)}"></tr>`);
        for(j = 0; j < 10; j++) {
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
const shipSizes = [1,2,3,3,4,5];
const randomPlacementPosition = Math.floor(Math.random() * 100);
console.log(randomPlacementPosition)
console.log(Math.floor(randomPlacementPosition / 10), randomPlacementPosition % 10);


$(`#ai-${randomPlacementPosition}`).css('background-color','red');
    for(i = 0; i < shipSizes.length; i++) {
        let isVertical = Math.random() < 0.5;
        let ship = [];
        for(j = 0; j < shipSizes[i]; j++){
            ship.push('+');
        }
        arrayOfShips.push(ship);
    }
    console.log(arrayOfShips)
}

generateShips()