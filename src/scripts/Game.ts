import AI from './AI.js';
import { playerSign, comSign, comDelay } from './settings.js';

export default class Game {
    private boardElem: HTMLElement;
    private ai: AI;
    private isPlayerTurn: boolean = true;
    private comMoveTimeoutId?: number;

    constructor(ai: AI, boardElem: HTMLElement) {
        this.ai = ai;
        this.boardElem = boardElem;
        this.boardElem.addEventListener('mouseup', (event) => this.onPlayerAction(event));
    }

    reset(): void {
        if (this.comMoveTimeoutId) clearTimeout(this.comMoveTimeoutId);
        this.resetBoardElements();
        this.ai.setFreshBoardState();
        this.isPlayerTurn = true;
    }

    resetBoardElements(): void {
        Array.from<HTMLDivElement>(this.boardElem.querySelectorAll('.board__field')).forEach((fieldElem) => {
            fieldElem.innerText = '';
        });
    }

    onPlayerAction(event: MouseEvent): void {
        const target: HTMLDivElement = event.target as HTMLDivElement;
        if (!this.isPlayerTurn || target.innerText) return;
        this.markField(target, playerSign);
    }

    comPlay(): void {
        let fieldToMark = 4;
        this.comMoveTimeoutId = setTimeout(() => this.comMarkField(fieldToMark), comDelay);
    }

    comMarkField(fieldId: number): void {
        this.markField(this.boardElem.querySelector('#field_' + fieldId) as HTMLDivElement, comSign);
    }

    finishTurn(): void {
        this.checkIfEnd();
        this.nextTurn();
    }

    checkIfEnd(): boolean {
        return false;
    }

    nextTurn(): void {
        if (this.isPlayerTurn) {
            this.isPlayerTurn = false;
            this.comPlay();
        } else {
            this.isPlayerTurn = true;
        }
    }

    markField(fieldElement: HTMLDivElement, sign: string): void {
        fieldElement.innerText = sign;
        this.finishTurn();
    }
}
