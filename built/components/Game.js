import { playerSign, comSign, comDelay } from '../settings.js';
export default class Game {
    constructor(ai, boardElem) {
        this.isPlayerTurn = true;
        this.ai = ai;
        this.boardElem = boardElem;
        this.boardElem.addEventListener('mouseup', (event) => this.onPlayerAction(event));
    }
    reset() {
        if (this.comMoveTimeoutId)
            clearTimeout(this.comMoveTimeoutId);
        this.resetBoardElements();
        this.ai.setFreshBoardState();
        this.isPlayerTurn = true;
    }
    resetBoardElements() {
        Array.from(this.boardElem.querySelectorAll('.board__field')).forEach((fieldElem) => {
            fieldElem.innerText = '';
        });
    }
    onPlayerAction(event) {
        const target = event.target;
        if (!this.isPlayerTurn || target.innerText)
            return;
        this.markField(target, playerSign);
    }
    comPlay() {
        let fieldToMark = this.ai.getNextMove(comSign, playerSign);
        //always true
        if (fieldToMark !== undefined) {
            this.comMoveTimeoutId = setTimeout(() => this.comMarkField(fieldToMark), comDelay);
        }
    }
    comMarkField(fieldId) {
        this.markField(this.boardElem.querySelector('#field_' + fieldId), comSign);
    }
    finishTurn() {
        if (!this.checkIfEnd()) {
            this.nextTurn();
        }
    }
    checkIfEnd() {
        let resolvedSolution = this.ai.getResolvedSolution();
        if (resolvedSolution) {
            this.triggerEnd(resolvedSolution.firstSign + ' won!');
            return true;
        }
        else if (!this.ai.isSolvable()) {
            this.triggerEnd('Draw!');
            return true;
        }
        return false;
    }
    triggerEnd(msg) {
        setTimeout(() => {
            alert(msg);
            this.reset();
        });
    }
    nextTurn() {
        if (this.isPlayerTurn) {
            this.isPlayerTurn = false;
            this.comPlay();
        }
        else {
            this.isPlayerTurn = true;
        }
    }
    markField(fieldElement, sign) {
        fieldElement.innerText = sign;
        this.ai.updateBoardState(parseInt(fieldElement.dataset.field), sign);
        this.finishTurn();
    }
}
