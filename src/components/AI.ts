import Solution from './Solution.js';

const solutionsTemplate = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];

export default class AI {
    private boardState!: Solution[];

    constructor() {
        this.setFreshBoardState();
    }

    setFreshBoardState(): void {
        this.boardState = solutionsTemplate.map((solutionTemplate) => new Solution(solutionTemplate));
    }
}
