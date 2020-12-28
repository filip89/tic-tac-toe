import Game from './Game.js';

const game = new Game();

document.getElementById('reset_button').addEventListener('click', () => game.reset());
