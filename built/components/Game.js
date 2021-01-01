import { playerSign, comSign, comDelay } from '../settings.js';
export default class Game {
    constructor(ai, boardElem, endMsgElem) {
        this.isPlayerTurn = true;
        this.ai = ai;
        this.boardElem = boardElem;
        this.endMsgElem = endMsgElem;
        this.boardElem.addEventListener('mouseup', (event) => this.onPlayerAction(event));
    }
    reset() {
        if (this.comMoveTimeoutId)
            clearTimeout(this.comMoveTimeoutId);
        this.resetBoardElements();
        this.hideEndMsg();
        this.ai.setFreshBoardState();
        this.isPlayerTurn = true;
    }
    resetBoardElements() {
        Array.from(this.boardElem.querySelectorAll('.board__field')).forEach((fieldElem) => {
            fieldElem.classList.remove('board__field--solved');
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
        if (!this.finishGameIfEnd()) {
            this.nextTurn();
        }
    }
    finishGameIfEnd() {
        let resolvedSolution = this.ai.getResolvedSolution();
        if (resolvedSolution) {
            this.showEndMsg(resolvedSolution.firstSign + ' won!');
            this.addVictoryAnimation(resolvedSolution);
            return true;
        }
        if (!this.ai.isSolvable()) {
            this.showEndMsg('Draw!');
            return true;
        }
        return false;
    }
    addVictoryAnimation(resolvedSolution) {
        resolvedSolution.fields.forEach((field) => {
            this.boardElem.querySelector('#field_' + field.id).classList.add('board__field--solved');
        });
    }
    showEndMsg(msg) {
        this.endMsgElem.innerText = msg;
        this.endMsgElem.style.visibility = 'visible';
        this.endMsgElem.style.opacity = '1';
    }
    hideEndMsg() {
        this.endMsgElem.style.visibility = 'hidden';
        this.endMsgElem.style.opacity = '0';
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
