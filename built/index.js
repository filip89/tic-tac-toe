var _a;
import AI from './components/AI.js';
import Game from './components/Game.js';
const boardElem = document.querySelector('.board');
const ai = new AI();
const game = new Game(ai, boardElem);
(_a = document.getElementById('reset_button')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => game.reset());
