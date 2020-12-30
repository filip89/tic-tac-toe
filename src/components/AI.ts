import Solution from './Solution.js';

//Ordered by priority (diagonals first)
const solutionsTemplate = [
    [0, 4, 8],
    [2, 4, 6],
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
];

export default class AI {
    private boardState!: Solution[];

    get centerMarked(): boolean {
        return !!this.boardState[0].fields[1].sign;
    }

    constructor() {
        this.setFreshBoardState();
    }

    setFreshBoardState(): void {
        this.boardState = solutionsTemplate.map((solutionTemplate) => new Solution(solutionTemplate));
    }

    isSolvable(): boolean {
        return !!this.boardState.find((solution) => solution.isSolvable());
    }

    getResolvedSolution(): Solution | undefined {
        return this.boardState.find((solution) => solution.isResolved());
    }

    updateBoardState(fieldId: number, sign: string): void {
        this.boardState.forEach((solution) => {
            let field = solution.fields.find((field) => field.id === fieldId);
            if (field) field.sign = sign;
        });
    }

    getNextMove(sign: string, opponentSign: string): number | undefined {
        if (!this.centerMarked) {
            return 4;
        }
        let victoryFieldId = this.getVictoryField(sign);
        if (victoryFieldId) return victoryFieldId;
        let opponentVictoryFieldId = this.getVictoryField(opponentSign);
        if (opponentVictoryFieldId) return opponentVictoryFieldId;
        return this.getBestAvailableOption(sign);
    }

    private getVictoryField(sign: string): number | undefined {
        return this.getSolvableSolutions(sign)
            .find((solution) => solution.getEmptyFields().length == 1)
            ?.getEmptyFields()[0].id;
    }

    private getBestAvailableOption(sign: string): number | undefined {
        let solvableSolutions = this.getSolvableSolutions(sign);
        if (solvableSolutions.length) {
            solvableSolutions.sort((a, b) => (a.getEmptyFields().length < b.getEmptyFields().length ? -1 : 0));
            let emptyFields = solvableSolutions[0].getEmptyFields();
            let cornerField = emptyFields.find((field) => [0, 2, 6, 8].includes(field.id));
            return cornerField ? cornerField.id : emptyFields[0].id;
        } else {
            let anyMarkableSolution = this.getAnyMarkableSolution();
            //always true (otherwise would end)
            if (anyMarkableSolution) {
                return anyMarkableSolution.getEmptyFields()[0].id;
            }
        }
    }

    private getAnyMarkableSolution(): Solution | undefined {
        return this.boardState.find((solution) => solution.isMarkable());
    }

    private getSolvableSolutions(sign: string): Solution[] {
        return this.boardState.filter((solution) => {
            return solution.isSolvableBySign(sign);
        });
    }
}
