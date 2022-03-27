import AI from './AI';
import { playerSign, comSign, comDelay } from '../settings';
import Solution from './Solution';

export default class Game {
    private endMsgElem: HTMLElement;
    private boardElem: HTMLElement;
    private ai: AI;
    private isPlayerTurn: boolean = true;
    private comMoveTimeoutId?: NodeJS.Timeout;

    constructor(ai: AI, boardElem: HTMLElement, endMsgElem: HTMLElement) {
        this.ai = ai;
        this.boardElem = boardElem;
        this.endMsgElem = endMsgElem;
        this.boardElem.addEventListener('mouseup', (event) => this.onPlayerAction(event));
    }

    public reset(): void {
        if (this.comMoveTimeoutId) clearTimeout(this.comMoveTimeoutId);
        this.resetBoardElements();
        this.hideEndMsg();
        this.ai.setFreshBoardState();
        this.isPlayerTurn = true;
    }

    private resetBoardElements(): void {
        Array.from<HTMLDivElement>(this.boardElem.querySelectorAll('.board__field')).forEach((fieldElem) => {
            fieldElem.classList.remove('board__field--solved');
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
        if (!this.finishGameIfEnd()) {
            this.nextTurn();
        }
    }

    private finishGameIfEnd(): boolean {
        let resolvedSolution = this.ai.getResolvedSolution();
        if (resolvedSolution) {
            this.showEndMsg(resolvedSolution!.firstSign + ' won!');
            this.addVictoryAnimation(resolvedSolution);
            return true;
        }
        if (!this.ai.isSolvable()) {
            this.showEndMsg('Draw!');
            return true;
        }
        return false;
    }

    private addVictoryAnimation(resolvedSolution: Solution): void {
        resolvedSolution.fields.forEach((field) => {
            (this.boardElem.querySelector('#field_' + field.id) as HTMLElement).classList.add('board__field--solved');
        });
    }

    private showEndMsg(msg: string): void {
        this.endMsgElem.innerText = msg;
        this.endMsgElem.style.visibility = 'visible';
        this.endMsgElem.style.opacity = '1';
    }

    private hideEndMsg(): void {
        this.endMsgElem.style.visibility = 'hidden';
        this.endMsgElem.style.opacity = '0';
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
