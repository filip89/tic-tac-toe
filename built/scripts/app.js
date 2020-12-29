import AI from './AI.js';
import Game from './Game.js';
export default function run() {
    var _a;
    const boardElem = document.querySelector('.board');
    const ai = new AI();
    const game = new Game(ai, boardElem);
    (_a = document.getElementById('reset_button')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => game.reset());
}
