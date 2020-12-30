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
    constructor() {
        this.setFreshBoardState();
    }
    get centerMarked() {
        return !!this.boardState[0].fields[1].sign;
    }
    setFreshBoardState() {
        this.boardState = solutionsTemplate.map((solutionTemplate) => new Solution(solutionTemplate));
    }
    getResolvedSolution() {
        return this.boardState.find((solution) => solution.isResolved());
    }
    updateBoardState(fieldId, sign) {
        this.boardState.forEach((solution) => {
            let field = solution.fields.find((field) => field.id === fieldId);
            if (field)
                field.sign = sign;
        });
    }
    getNextMove(sign, opponentSign) {
        if (!this.centerMarked) {
            return 4;
        }
        let solvableSolutions = this.getSolvableSolutions(sign);
        let setMatchSolution = solvableSolutions.find((solution) => solution.getEmptyFields().length == 1);
        if (setMatchSolution)
            return setMatchSolution.getEmptyFields()[0].id;
        let opponentSetMatchSolution = this.getSolvableSolutions(opponentSign).find((solution) => solution.getEmptyFields().length == 1);
        if (opponentSetMatchSolution)
            return opponentSetMatchSolution.getEmptyFields()[0].id;
        if (solvableSolutions.length) {
            solvableSolutions.sort((a, b) => (a.getEmptyFields().length < b.getEmptyFields().length ? -1 : 0));
            let emptyFields = solvableSolutions[0].getEmptyFields();
            let cornerField = emptyFields.find((field) => [0, 2, 6, 8].includes(field.id));
            return cornerField ? cornerField.id : emptyFields[0].id;
        }
        //never used
        let anyMarkableSolution = this.getAnyMarkableSolution();
        if (anyMarkableSolution) {
            return anyMarkableSolution.getEmptyFields()[0].id;
        }
    }
    getAnyMarkableSolution() {
        return this.boardState.find((solution) => solution.isMarkable());
    }
    getSolvableSolutions(sign) {
        return this.boardState.filter((solution) => {
            return solution.isSolvableBySign(sign);
        });
    }
    isSolvable() {
        return !!this.boardState.find((solution) => solution.isSolvable());
    }
}
