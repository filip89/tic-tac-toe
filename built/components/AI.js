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
        let victoryField = this.getVictoryField(sign);
        if (victoryField !== undefined)
            return victoryField;
        let opponentVictoryField = this.getVictoryField(opponentSign);
        if (opponentVictoryField !== undefined)
            return opponentVictoryField;
        let solvableSolutionField = this.getSolvableSolutionFieldId(sign, opponentSign);
        if (solvableSolutionField !== undefined)
            return solvableSolutionField;
        let markableSolutionField = this.getAnyMarkableSolutionFieldId();
        //always true (otherwise would end)
        if (markableSolutionField !== undefined)
            return markableSolutionField;
    }
    getVictoryField(sign) {
        var _a;
        return (_a = this.getSolvableSolutions(sign)
            .find((solution) => solution.getEmptyFields().length == 1)) === null || _a === void 0 ? void 0 : _a.getEmptyFields()[0].id;
    }
    getSolvableSolutionFieldId(sign, opponentSign) {
        let solvableSolutions = this.getSolvableSolutions(sign);
        if (solvableSolutions.length) {
            let opponentDoubleThreatSolutions = this.getDoubleThreatSolutions(opponentSign);
            if (opponentDoubleThreatSolutions.length) {
                let intersectedSolutions = AI.getIntersectedSolutions(solvableSolutions, opponentDoubleThreatSolutions);
                let criticalFields = this.getSolutionsJointFields(opponentDoubleThreatSolutions);
                let acceptableSolution = intersectedSolutions.find((solution) => {
                    let solutionEmptyFields = solution.getEmptyFields();
                    if (solutionEmptyFields.length < 3) {
                        let criticalFieldsCount = solutionEmptyFields.filter((field) => criticalFields.includes(field.id)).length;
                        if (criticalFieldsCount < 2) {
                            return true;
                        }
                    }
                    return false;
                });
                let potentialFields = acceptableSolution.getEmptyFields().map((field) => field.id);
                let chosenCriticalField = potentialFields.find((fieldId) => criticalFields.includes(fieldId));
                return chosenCriticalField ? chosenCriticalField : potentialFields[0];
            }
            else {
                solvableSolutions.sort((a, b) => (a.getEmptyFields().length < b.getEmptyFields().length ? -1 : 0));
                let emptyFields = solvableSolutions[0].getEmptyFields();
                let cornerField = emptyFields.find((field) => [0, 2, 6, 8].includes(field.id));
                return cornerField ? cornerField.id : emptyFields[0].id;
            }
        }
    }
    getSolutionsJointFields(solutions) {
        let solutionsEmptyFieldIds = solutions.reduce((arr, solution) => {
            arr.push(...solution.getEmptyFields().map((field) => field.id));
            return arr;
        }, []);
        return solutionsEmptyFieldIds.reduce((duplicates, item) => {
            if (solutionsEmptyFieldIds.filter((field) => item === field).length > 1 && !duplicates.includes(item)) {
                duplicates.push(item);
            }
            return duplicates;
        }, []);
    }
    getDoubleThreatSolutions(sign) {
        let solvableStartedSolutions = this.getSolvableSolutions(sign).filter((solution) => solution.getEmptyFields().length < 3);
        if (solvableStartedSolutions.length < 2)
            return [];
        return AI.getIntersectedSolutions(solvableStartedSolutions, solvableStartedSolutions);
    }
    static getIntersectedSolutions(targetSolutions, intersectorSolutions) {
        return targetSolutions.reduce((intersected, targetSolution) => {
            let intersects = !!intersectorSolutions.filter((intersectorSolution) => {
                if (targetSolution === intersectorSolution)
                    return false;
                let emptySolutionFieldIds = intersectorSolution.getEmptyFields().map((field) => field.id);
                return targetSolution.getEmptyFields().some((field) => {
                    return emptySolutionFieldIds.includes(field.id);
                });
            }).length;
            if (intersects)
                intersected.push(targetSolution);
            return intersected;
        }, []);
    }
    getAnyMarkableSolutionFieldId() {
        var _a;
        return (_a = this.boardState.find((solution) => solution.isMarkable())) === null || _a === void 0 ? void 0 : _a.getEmptyFields()[0].id;
    }
    getSolvableSolutions(sign) {
        return this.boardState.filter((solution) => {
            return solution.isSolvableBySign(sign);
        });
    }
}
