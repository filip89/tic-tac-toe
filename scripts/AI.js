import solutionsTemplate from './solutions-template.js';
import Solution from './Solution.js';

export default class AI {
    constructor() {
        this.setFreshBoardState();
    }

    setFreshBoardState() {
        this.boardState = solutionsTemplate.map((solutionTemplate) => new Solution(solutionTemplate));
    }
}
