import AI from './AI.js';
import { playerSign, comSign, comDelay } from '../settings.js';

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

    public reset(): void {
        if (this.comMoveTimeoutId) clearTimeout(this.comMoveTimeoutId);
        this.resetBoardElements();
        this.ai.setFreshBoardState();
        this.isPlayerTurn = true;
    }

    private resetBoardElements(): void {
        Array.from<HTMLDivElement>(this.boardElem.querySelectorAll('.board__field')).forEach((fieldElem) => {
            fieldElem.innerText = '';
        });
    }

    private onPlayerAction(event: MouseEvent): void {
        const target: HTMLDivElement = event.target as HTMLDivElement;
        if (!this.isPlayerTurn || target.innerText) return;
        this.markField(target, playerSign);
    }

    private comPlay(): void {
        let fieldToMark = this.ai.getNextMove(comSign, playerSign);
        //always true
        if (fieldToMark !== undefined) {
            this.comMoveTimeoutId = setTimeout(() => this.comMarkField(fieldToMark!), comDelay);
        }
    }

    private comMarkField(fieldId: number): void {
        this.markField(this.boardElem.querySelector('#field_' + fieldId) as HTMLDivElement, comSign);
    }

    private finishTurn(): void {
        if (!this.checkIfEnd()) {
            this.nextTurn();
        }
    }

    private checkIfEnd(): boolean {
        let resolvedSolution = this.ai.getResolvedSolution();
        if (resolvedSolution) {
            this.triggerEnd(resolvedSolution!.firstSign + ' won!');
            return true;
        } else if (!this.ai.isSolvable()) {
            this.triggerEnd('Draw!');
            return true;
        }
        return false;
    }

    private triggerEnd(msg: string): void {
        setTimeout(() => {
            alert(msg);
            this.reset();
        });
    }

    private nextTurn(): void {
        if (this.isPlayerTurn) {
            this.isPlayerTurn = false;
            this.comPlay();
        } else {
            this.isPlayerTurn = true;
        }
    }

    private markField(fieldElement: HTMLDivElement, sign: string): void {
        fieldElement.innerText = sign;
        this.ai.updateBoardState(parseInt(fieldElement.dataset.field as string), sign);
        this.finishTurn();
    }
}
