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
        let victoryField: number | undefined = this.getVictoryField(sign);
        if (victoryField !== undefined) return victoryField;
        let opponentVictoryField: number | undefined = this.getVictoryField(opponentSign);
        if (opponentVictoryField !== undefined) return opponentVictoryField;
        let solvableSolutionField: number | undefined = this.getSolvableSolutionFieldId(sign, opponentSign);
        if (solvableSolutionField !== undefined) return solvableSolutionField;
        let markableSolutionField = this.getAnyMarkableSolutionFieldId();
        //always true (otherwise would end)
        if (markableSolutionField !== undefined) return markableSolutionField;
    }

    private getVictoryField(sign: string): number | undefined {
        return this.getSolvableSolutions(sign)
            .find((solution) => solution.getEmptyFields().length == 1)
            ?.getEmptyFields()[0].id;
    }

    getSolvableSolutionFieldId(sign: string, opponentSign: string): number | undefined {
        let solvableSolutions: Solution[] = this.getSolvableSolutions(sign);
        if (solvableSolutions.length) {
            let opponentDoubleThreatSolutions: Solution[] = this.getDoubleThreatSolutions(opponentSign);
            if (opponentDoubleThreatSolutions.length) {
                let intersectedSolutions: Solution[] = AI.getIntersectedSolutions(
                    solvableSolutions,
                    opponentDoubleThreatSolutions
                );
                let criticalFields: number[] = this.getSolutionsJointFields(opponentDoubleThreatSolutions);
                let acceptableSolution: Solution = intersectedSolutions.find((solution) => {
                    let solutionEmptyFields = solution.getEmptyFields();
                    if (solutionEmptyFields.length < 3) {
                        let criticalFieldsCount: number = solutionEmptyFields.filter((field) =>
                            criticalFields.includes(field.id)
                        ).length;
                        if (criticalFieldsCount < 2) {
                            return true;
                        }
                    }
                    return false;
                })!;
                let potentialFields: number[] = acceptableSolution.getEmptyFields().map((field) => field.id);
                let chosenCriticalField: number | undefined = potentialFields.find((fieldId) =>
                    criticalFields.includes(fieldId)
                );
                return chosenCriticalField ? chosenCriticalField : potentialFields[0];
            } else {
                solvableSolutions.sort((a, b) => (a.getEmptyFields().length < b.getEmptyFields().length ? -1 : 0));
                let emptyFields = solvableSolutions[0].getEmptyFields();
                let cornerField = emptyFields.find((field) => [0, 2, 6, 8].includes(field.id));
                return cornerField ? cornerField.id : emptyFields[0].id;
            }
        }
    }

    private getSolutionsJointFields(solutions: Solution[]): number[] {
        let solutionsEmptyFieldIds: number[] = solutions.reduce<number[]>((arr, solution) => {
            arr.push(...solution.getEmptyFields().map((field) => field.id));
            return arr;
        }, []);
        return solutionsEmptyFieldIds.reduce<number[]>((duplicates, item) => {
            if (solutionsEmptyFieldIds.filter((field) => item === field).length > 1 && !duplicates.includes(item)) {
                duplicates.push(item);
            }
            return duplicates;
        }, []);
    }

    private getDoubleThreatSolutions(sign: string): Solution[] {
        let solvableStartedSolutions: Solution[] = this.getSolvableSolutions(sign).filter(
            (solution) => solution.getEmptyFields().length < 3
        );
        if (solvableStartedSolutions.length < 2) return [];
        return AI.getIntersectedSolutions(solvableStartedSolutions, solvableStartedSolutions);
    }

    private static getIntersectedSolutions(targetSolutions: Solution[], intersectorSolutions: Solution[]): Solution[] {
        return targetSolutions.reduce<Solution[]>((intersected, targetSolution) => {
            let intersects: boolean = !!intersectorSolutions.filter((intersectorSolution) => {
                if (targetSolution === intersectorSolution) return false;
                let emptySolutionFieldIds: number[] = intersectorSolution.getEmptyFields().map((field) => field.id);
                return targetSolution.getEmptyFields().some((field) => {
                    return emptySolutionFieldIds.includes(field.id);
                });
            }).length;
            if (intersects) intersected.push(targetSolution);
            return intersected;
        }, []);
    }

    private getAnyMarkableSolutionFieldId(): number | undefined {
        return this.boardState.find((solution) => solution.isMarkable())?.getEmptyFields()[0].id;
    }

    private getSolvableSolutions(sign: string): Solution[] {
        return this.boardState.filter((solution) => {
            return solution.isSolvableBySign(sign);
        });
    }
}
