import './styles/main.scss';
import './components/board_area/board_area'
import './components/game-timer/game-timer';
import './components/game-score/game-score';
import './components/high-score/hight-score';
import './components/game-select/game-select';

import { BoardSizes } from './constants';

document.addEventListener("DOMContentLoaded", main);

function main() {
  const gameSelect = document.createElement('game-select');
  gameSelect.onchange = setGame(...installAppComponents());

  const footer = document.querySelector('footer');
  footer.appendChild(gameSelect);
}

function installAppComponents() {
  const highScore = document.createElement('high-score');

  const gameScore = document.createElement('game-score');
  gameScore.onchange = event => highScore.score = event.detail;

  const timer = document.createElement('game-timer');
  timer.onabort = () => gameScore.clear()

  const board = document.createElement('board-area');
  board.onclick = setScore(gameScore);

  return [timer, gameScore, highScore, board];
}

function setGame(timer, gameScore, highScore, board) {
  return ({ detail }) => {
    board.setAttribute('size', detail.size || BoardSizes.default());
    if (detail.restart === true) {
      gameScore.clear();
      timer.clear();
    } else {
      setHeaderContent(timer, gameScore, highScore);
      setMainContent(board);
    }
  }
}

function setHeaderContent(timer, gameScore, highScore) {
  const header = document.querySelector('header');
  header.appendChild(timer);
  header.appendChild(gameScore);
  header.appendChild(highScore);
}

function setMainContent(board) {
  const mainContentArea = document.querySelector('main');
  mainContentArea.appendChild(board);
}

function setScore(gameScoreNode) {
  return ({ detail }) => {
    if (detail.luckyClick === true) {
      gameScoreNode.scoreUp();
    } else {
      gameScoreNode.scoreDown();
    }
  }
}
