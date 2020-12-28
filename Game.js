import { playerSign, comSign, comDelay } from './settings.js';

export default class Game {
    boardDiv;
    boardData;
    isPlayerTurn;
    comMoveTimeoutId;

    constructor() {
        this.boardDiv = document.querySelector('.board');
        this.boardDiv.addEventListener('mouseup', (event) => this.onPlayerAction(event));
        this.setFreshGameData();
    }

    reset() {
        clearTimeout(this.comMoveTimeoutId);
        this.resetBoardElements();
        this.setFreshGameData();
    }

    resetBoardElements() {
        Array.from(this.boardDiv.querySelectorAll('.game__field')).forEach((fieldElem) => {
            fieldElem.innerText = '';
        });
    }

    setFreshGameData() {
        this.boardData = [null, null, null, null, null, null, null, null, null];
        this.isPlayerTurn = true;
    }

    onPlayerAction({ target }) {
        if (!this.isPlayerTurn || target.innerText) return;
        this.markField(target, playerSign);
        this.onTurnFinish();
    }

    comPlay() {
        let fieldId = 4;
        this.comMoveTimeoutId = setTimeout(() => this.comMarkField(fieldId), comDelay);
        this.boardData[fieldId] = comSign;
    }

    comMarkField(fieldId) {
        this.boardDiv.querySelector('#field_' + fieldId).innerText = comSign;
        this.onTurnFinish();
    }

    onTurnFinish() {
        this.checkIfEnd();
        this.nextTurn();
    }

    checkIfEnd() {
        return false;
    }

    nextTurn() {
        if (this.isPlayerTurn) {
            this.isPlayerTurn = false;
            this.comPlay();
        } else {
            this.isPlayerTurn = true;
        }
    }

    markField(fieldElement, sign) {
        this.boardData[fieldElement.id] = sign;
        fieldElement.innerText = sign;
    }
}
