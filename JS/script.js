const userGameTable = $('#user-game-table');


function generateGameBoard(player) {
    for(i = 0; i < 10; i++) {
        $(`#${player}-game-table`).append(`<tr class='' id="${player + '-' + 'row' + '-' + (i * 10)}"></tr>`);
        for(j = 0; j < 10; j++) {
            $("tr").last().append(`<th class='tg-0lax' id="${(i * 10 + j)}"></th>`);
        }
    }
}
generateGameBoard('user')

generateGameBoard('ai')