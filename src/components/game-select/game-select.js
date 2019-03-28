import { BoardSizes } from '../../constants';

const template = document.createElement('template');
template.innerHTML =
  `
  <style>
    :host {
      display: flex;
      justify-content: space-around;
    }
    select, button {
      height: 34px;
      width: 120px;
      font-size: 14px;
    }
  </style>
  <select></select>
  <button>Start</button>
  `;

class GameSelect extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.selectBox = this.shadowRoot.querySelector('select');
    this.button = this.shadowRoot.querySelector('button');
    this.restartMode = false;
  }

  connectedCallback() {
    this.setSelectionBox();
    this.setBtnListener();
  }

  setSelectionBox() {
    let option = document.createElement('option');
    option.innerText = 'Easy';
    option.value = BoardSizes.THREE_BY_THREE;
    this.selectBox.appendChild(option);
    option = document.createElement('option');
    option.innerText = 'Medium';
    option.value = BoardSizes.FOUR_BY_FOUR;
    this.selectBox.appendChild(option);
    option = document.createElement('option');
    option.innerText = 'Hard';
    option.value = BoardSizes.SIX_BY_SIX;
    this.selectBox.appendChild(option);
    this.selectBox.value = BoardSizes.default();
  }

  setBtnListener() {
    this.button.addEventListener('click', event => {
      event.stopPropagation();
      this.dispatchEvent(new CustomEvent('change', {
        detail: {
          restart: this.getRestartMode(),
          size: this.selectBox.value
        }
      }));
    });
  }

  getRestartMode() {
    if (this.restartMode) return true;

    this.restartMode = true;
    this.button.innerText = 'Restart';
    return false;
  }
}

window.customElements.define('game-select', GameSelect);
