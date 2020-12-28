import AI from './scripts/AI.js';
import Game from './scripts/Game.js';

const boardElem = document.querySelector('.board');
const ai = new AI();
const game = new Game(ai, boardElem);

document.getElementById('reset_button').addEventListener('click', () => game.reset());
