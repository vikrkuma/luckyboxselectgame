import './styles/main.scss';
import './components/board_area/board_area'
import './components/game-timer/game-timer';
import './components/game-score/game-score';
import './components/high-score/hight-score';
import './components/game-select/game-select';

import { BoardSizes } from './constants';

document.addEventListener("DOMContentLoaded", main);

/**
 * Bootstraps the lucky selection board playing game application.
 */
function main() {
  const appComponents = installAppComponents();
  const gameSelect = document.createElement('game-select');
  gameSelect.onchange = setGame(...appComponents);

  const footer = document.querySelector('footer');
  footer.appendChild(gameSelect);
}

/**
 * Initializes all the main game components.
 */
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

/**
 * Starts/Restart the game when user clicks on start or restart with the
 * current board size selection.
 * @param {*} timer Timer component.
 * @param {*} gameScore Current score component.
 * @param {*} highScore Highest score component.
 * @param {*} board Main playing board component.
 */
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

/**
 * Sets the timer, current and highest score component to the header of page.
 * @param {*} timer Timer component.
 * @param {*} gameScore Current score component.
 * @param {*} highScore Highest score component.
 */
function setHeaderContent(timer, gameScore, highScore) {
  const header = document.querySelector('header');
  header.appendChild(timer);
  header.appendChild(gameScore);
  header.appendChild(highScore);
}

/**
 * Sets the main playing board component as the main content of the application.
 * @param {*} board Main playing board component.
 */
function setMainContent(board) {
  const mainContentArea = document.querySelector('main');
  mainContentArea.appendChild(board);
}

/**
 * Sets the score up or down depending on the user's ability to select the
 * highlighted box.
 * @param {*} gameScoreNode current score component of the application
 */
function setScore(gameScoreNode) {
  return ({ detail }) => {
    if (detail.luckyClick === true) {
      gameScoreNode.scoreUp();
    } else {
      gameScoreNode.scoreDown();
    }
  }
}
