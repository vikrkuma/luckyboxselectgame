const template = document.createElement('template');
template.innerHTML = `<p class="game-score"></p>`;

class GameScore extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.scoreNode = this.shadowRoot.querySelector('.game-score');
    this._score = 0;
  }

  connectedCallback() {
    this.score = 0;
  }

  static get observedAttributes() {
    return ['score'];
  }

  attributeChangedCallback(attributeName, oldValue, newValue) {
    if (attributeName === 'score' && oldValue !== newValue) {
      this.score = newValue;
    }
  }

  set score(score) {
    if (!this.scoreNode) return;

    if (score < 0) score = 0;

    this.scoreNode.innerText = `Score: ${score}`;

    this.dispatchEvent(new CustomEvent('change', { detail: score }));

    this._score = score;
  }

  get score() {
    return this._score;
  }

  get scoreUp() {
    return () => this.score++;
  }

  get scoreDown() {
    return () => this.score--;
  }

  get clear() {
    return () => this.score = 0;
  }
}

window.customElements.define('game-score', GameScore);
