import AI from './scripts/AI.js';
import Game from './scripts/Game.js';

const boardElem: HTMLElement = document.querySelector('.board') as HTMLElement;
const ai: AI = new AI();
const game = new Game(ai, boardElem);

document.getElementById('reset_button')?.addEventListener('click', () => game.reset());
