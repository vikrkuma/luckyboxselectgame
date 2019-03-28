import { BoardSizes } from '../../constants';

const template = document.createElement('template');
template.innerHTML =
  `
  <style>
    .board-grid {
      display: grid;
      height: 48vh;
      width: 48vh;
      border: 1px solid red;
    }
    .board-grid > .board-grid-cell {
      border: 2px solid red;
      background: grey;
    }
    .board-grid > .board-grid-cell.selected {
      border: 2px solid red;
      background: green;
    }
    .board-grid.three-by-three {
      grid-template-areas:
        ". . ."
        ". . ."
        ". . .";
    }
    .board-grid.four-by-four {
      grid-template-areas:
        ". . . ."
        ". . . ."
        ". . . ."
        ". . . .";
    }
    .board-grid.six-by-six {
      grid-template-areas:
        ". . . . . ."
        ". . . . . ."
        ". . . . . ."
        ". . . . . ."
        ". . . . . ."
        ". . . . . .";
    }
  </style>
  <div class="board-grid">
  </div>
  `;

const UNSPECIFIED_BOARD_AREA_SIZE_ERROR =
  `Wrong size specified for board-area. Should be [3x3, 4x4, 6x6]`;

class BoardArea extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.boardGrid = this.shadowRoot.querySelector('.board-grid');
    this.totalCompartment = 0;
    this.interval = null;
  }

  connectedCallback() {
    this.boardGrid.addEventListener('click', event => {
      event.stopPropagation();
      const luckyClick = event.target.classList.contains('selected');
      this.dispatchClickEvent({ luckyClick });
    });
  }

  disconnectedCallback() {
    this.boardGrid.removeEventListener('click');
    this.stopBoardGame();
  }

  static get observedAttributes() {
    return ['size'];
  }

  attributeChangedCallback(attributeName, oldValue, newValue) {
    if (attributeName === 'size' && oldValue !== newValue) {
      this.setSize(newValue);
    }
  }

  dispatchClickEvent(detail) {
    this.dispatchEvent(new CustomEvent('click', { detail }));
  }

  startBoardGame() {
    if (!this.totalCompartment) return;

    this.stopBoardGame();

    this.interval = setInterval(() => {
      const selectedCellQuery = '.board-grid-cell.selected';
      const selectedCell = this.shadowRoot.querySelector(selectedCellQuery);
      if (selectedCell) {
        selectedCell.classList.remove('selected');
      }

      const cells = this.shadowRoot.querySelectorAll('.board-grid-cell');
      const max = this.totalCompartment;
      const index = Math.floor(Math.random() * Math.floor(max));
      cells[index].classList.add('selected');
    }, 1000);
  }

  stopBoardGame() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  setSize(size) {
    this.boardGrid.innerHTML = '';
    this.totalCompartment = 0;
    switch (size) {
      case BoardSizes.FOUR_BY_FOUR:
        this.boardGrid.classList.remove('six-by-six');
        this.boardGrid.classList.remove('three-by-three');
        this.boardGrid.classList.add('four-by-four');
        this.totalCompartment = 16;
        break;
      case BoardSizes.SIX_BY_SIX:
        this.boardGrid.classList.remove('four-by-four');
        this.boardGrid.classList.remove('three-by-three');
        this.boardGrid.classList.add('six-by-six');
        this.totalCompartment = 36;
        break;
      case BoardSizes.THREE_BY_THREE:
        this.boardGrid.classList.remove('four-by-four');
        this.boardGrid.classList.remove('six-by-six');
        this.boardGrid.classList.add('three-by-three');
        this.totalCompartment = 9;
        break;
      default:
        console.error(UNSPECIFIED_BOARD_AREA_SIZE_ERROR);
    }
    let totalCompartment = this.totalCompartment;
    while (totalCompartment--) {
      const compartment = document.createElement('div');
      compartment.classList.add('board-grid-cell');
      this.boardGrid.appendChild(compartment);
    }
    this.startBoardGame();
  }

}

window.customElements.define('board-area', BoardArea);
