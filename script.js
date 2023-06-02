// Minimum Requirements:
// Display an empty tic-tac-toe board when the 
// page is initially displayed.
// A player can click on the nine cells to make a move.
// Every click will alternate between marking an X and O.
// Once occupied with an X or O, the cell cannot be played 
// again.
// Provide a Reset Game button that will clear the contents
//  of the board.



/*----- constants -----*/
const COLORS = {
    '0' : 'white',
    '1' : 'red',
    '-1' : 'green'
};

const PLAYERS =  {
    '0' : ' ',
    '1' : 'X',
    '-1': 'O'
};



/*----- state variables -----*/
let board; //array of 7 column arrays
let turn; //1 or -1
let winner; //null = no winner; 1 or -1; 'T' = tie


/*----- cached elements  -----*/
const messageEl = document.querySelector('h1');
const playAgainBtn = document.querySelector('button');
const playables = [...document.querySelectorAll('#board > div')];
//const markerElements = [...document.querySelectorAll('#markers > div')];


//document.getElementById('markers').addEventListener('click', handleDrop);
//document.querySelectorAll('#board > div').addEventListener('click', handleMove);
playAgainBtn.addEventListener('click', init);
playables.forEach(function(playable) {
    playable.addEventListener('click', handleMove);
    playable.addEventListener('mouseover', hoverBackground);
    playable.addEventListener('mouseout', hoverBackgroundOff)
});

/*----- functions -----*/
init();
//must invoke init() to start
//Initialize all state, then call render()
function init() {
    board = [
        [0,0,0], //col 0
        [0,0,0], //col 1
        [0,0,0], //col 2
    ];
    turn = 1;
    winner = null;
    render();
}

function hoverBackground(evt) {
    evt.target.style.backgroundColor = COLORS[turn];
}
function hoverBackgroundOff(evt) {
    evt.target.style.backgroundColor = '';
}

function handleMove(evt) {
    cellId = evt.target.id;
    // const colIdx = cellId.substr(1,1);
    const colIdx = parseInt(cellId.substr(1,1));
    const rowIdx = parseInt(cellId.substr(3,1));

    const colArr = board[colIdx];
    // const rowIdx = cellId.substr(3, 1);
    if(colArr[rowIdx] !== 0 || winner) return;
    colArr[rowIdx] = turn;
    turn *= -1;
    winner = getWinner(colIdx, rowIdx);

    render();
    
    //const colIdx = board.indexOf(evt.target.cellId);
    console.log(colIdx);
    console.log(rowIdx);
}
function getWinner(colIdx, rowIdx) {
    return checkVerticalWin(colIdx, rowIdx) ||
           checkHorizontalWin(colIdx, rowIdx) ||
           checkDiagonalWin(colIdx, rowIdx);
}

//created to be able to evaluate grids bgr than 3x3
function checkVerticalWin(colIdx, rowIdx) {
    adjCountUp = countAdjacent(colIdx, rowIdx, 0, 1);
    adjCountDown = countAdjacent(colIdx, rowIdx, 0, -1);
    return (adjCountUp + adjCountDown + 1) >= 3 ? board[colIdx][rowIdx] : null;
}

function checkHorizontalWin(colIdx, rowIdx) {
    adjCountRight = countAdjacent(colIdx, rowIdx, 1, 0);
    adjCountLeft = countAdjacent(colIdx, rowIdx, -1, 0);
    return (adjCountRight + adjCountLeft + 1) >= 3 ? board[colIdx][rowIdx] : null;
}
function checkDiagonalWin(colIdx, rowIdx) {
    adjCountNW = countAdjacent(colIdx, rowIdx, -1, -1);
    adjCountSE = countAdjacent(colIdx, rowIdx, 1, 1);
    adjCountNE = countAdjacent(colIdx, rowIdx, 1, -1);
    adjCountSW = countAdjacent(colIdx, rowIdx, -1, 1);
    return (adjCountNW + adjCountSE + 1) >= 3  ||
    (adjCountNE + adjCountSW + 1) >= 3 ? board[colIdx][rowIdx] : null;
}

function countAdjacent(colIdx, rowIdx, colOffset, rowOffset) {
    //shortcut variable to player value
    const player = board[colIdx][rowIdx];
    //const ? i thought it could not be modified
    //track count of adjacent cells w same player value

    //initalize count for num in a row
    //scope? wouldnt this count be eliminated once we enter while loop?
    let count = 0;

    colIdx += colOffset;
    rowIdx += rowOffset;
    while(
        //ensure clicked box is within bounds of the board
        //and is a valid move 
        board[colIdx] !== undefined && board[colIdx][rowIdx] != undefined &&
        board[colIdx][rowIdx] === player) {
            count++;
            colIdx += colOffset;
            rowIdx += rowOffset;

    }
    return count;

}

//Visualize all state in DOM
function render() {
    renderBoard(); 
    renderMessage();
    renderControls(); //Hide/Show UI elements
}

function renderBoard() {
    //how does this work? -> where are we pulling
    // colArr and colIdx from?
    board.forEach(function(colArr, colIdx) {
        console.log(colIdx, colArr);
        colArr.forEach(function(cellVal, rowIdx) {
            const cellId = `c${colIdx}r${rowIdx}`;
            const cellEl = document.getElementById(cellId);
            cellEl.style.color = COLORS[cellVal];
            cellEl.textContent = PLAYERS[cellVal];
            console.log(colIdx, rowIdx, cellVal);
        });
        
    });

}

function renderMessage() {
    if(winner == 'T') {
        messageEl.innerText = "It's a Tie!!!";
    }
    else if(winner) {
        messageEl.innerHTML = `<span style="color: ${COLORS[winner]}">${COLORS[winner].toUpperCase()} Wins!</span>`;
    }
    else {
        messageEl.innerHTML = `<span style="color: ${COLORS[turn]}">${COLORS[turn].toUpperCase()}'s Turn</span>`;
    }
}

function renderControls() {
    //Ternary expression is the goto when 1 of 2 values needs to be returned
    // playAgainBtn.style.display = 'none'; completely removes from dom
    //in this case, we need visibility attribute
    playAgainBtn.style.visibility = winner ? 'visible' : 'hidden';
     //iterate over marker elements to hide/show if column full(no 0's)/ not full 
}   