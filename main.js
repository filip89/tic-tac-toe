const playerSign = 'X';
const comSign = 'O';
const comDelay = 500;
let isPlayerTurn = true;
let board = [null, null, null, null, null, null, null, null, null];
let solutions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];

function onBoardMouseUp({ target }) {
    if (!isPlayerTurn || target.innerText) return;
    markField(target, playerSign);
    onTurnFinish();
}

function comPlay() {
    let fieldId = 4;
    setTimeout(() => comMarkField(fieldId), comDelay);
    board[fieldId] = comSign;
}

function comMarkField(fieldId) {
    document.getElementById(fieldId).innerText = comSign;
    onTurnFinish();
}

function onTurnFinish() {
    checkIfEnd();
    nextTurn();
}

const winCombinations = [];

function checkIfEnd() {
    return false;
}

function nextTurn() {
    if (isPlayerTurn) {
        isPlayerTurn = false;
        comPlay();
    } else {
        isPlayerTurn = true;
    }
}

function markField(fieldElement, sign) {
    board[fieldElement.id] = sign;
    fieldElement.innerText = sign;
}
