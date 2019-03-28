const template = document.createElement('template');
template.innerHTML =
  `
  <style>
  </style>
  <p class="high-score"></p>
  `;

class HighScore extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.highScoreNode = this.shadowRoot.querySelector('.high-score');
    this.highestScore = -1;
  }

  set score(score) {
    if (!this.highScoreNode) return;

    if (this.highestScore === -1) {
      const localScore = window.localStorage.getItem('highest-score');
      this.highestScore = localScore || 0;
    }

    if (score > this.highestScore) this.highestScore = score;

    this.highScoreNode.innerText = `Highest Score: ${this.highestScore}`;

    window.localStorage.setItem('highest-score', this.highestScore);
  }
}

window.customElements.define('high-score', HighScore);
