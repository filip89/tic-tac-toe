import solutionsTemplate from './solutions-template.js';
import Solution from './Solution.js';

export default class AI {

    private boardState!: Solution[];

    constructor() {
        this.setFreshBoardState();
    }

    setFreshBoardState(): void {
        this.boardState = solutionsTemplate.map((solutionTemplate) => new Solution(solutionTemplate));
    }
}
