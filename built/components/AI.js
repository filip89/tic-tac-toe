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
    isSolvable() {
        return !!this.boardState.find((solution) => solution.isSolvable());
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
        let victoryFieldId = this.getVictoryField(sign);
        if (victoryFieldId)
            return victoryFieldId;
        let opponentVictoryFieldId = this.getVictoryField(opponentSign);
        if (opponentVictoryFieldId)
            return opponentVictoryFieldId;
        return this.getBestAvailableOption(sign);
    }
    getVictoryField(sign) {
        var _a;
        return (_a = this.getSolvableSolutions(sign)
            .find((solution) => solution.getEmptyFields().length == 1)) === null || _a === void 0 ? void 0 : _a.getEmptyFields()[0].id;
    }
    getBestAvailableOption(sign) {
        let solvableSolutions = this.getSolvableSolutions(sign);
        if (solvableSolutions.length) {
            solvableSolutions.sort((a, b) => (a.getEmptyFields().length < b.getEmptyFields().length ? -1 : 0));
            let emptyFields = solvableSolutions[0].getEmptyFields();
            let cornerField = emptyFields.find((field) => [0, 2, 6, 8].includes(field.id));
            return cornerField ? cornerField.id : emptyFields[0].id;
        }
        else {
            let anyMarkableSolution = this.getAnyMarkableSolution();
            //always true (otherwise would end)
            if (anyMarkableSolution) {
                return anyMarkableSolution.getEmptyFields()[0].id;
            }
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
}
