import './style.css';
import AI from './app/components/AI';
import Game from './app/components/Game';

const endMsgElem: HTMLElement = document.querySelector('.end_message') as HTMLElement;
const boardElem: HTMLElement = document.querySelector('.board') as HTMLElement;
const ai: AI = new AI();
const game = new Game(ai, boardElem, endMsgElem);

document.getElementById('reset_button')?.addEventListener('click', () => game.reset());
