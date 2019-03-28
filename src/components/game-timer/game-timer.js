const template = document.createElement('template');
template.innerHTML = `<p class="timer-time"></p>`;

class GameTimer extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.interval = null;
    this.time = 120;
  }

  connectedCallback() {
    const timer = this.shadowRoot.querySelector('.timer-time');
    const updateTimer = this.updateTime.bind(this, timer);
    this.interval = setInterval(updateTimer, 1000);
  }

  disconnectedCallback() {
    this.stopTime();
  }

  updateTime(timerNode) {
    if (!timerNode) return;

    timerNode.innerText = `Time: ${this.time}sec`;
    if (this.time-- === 0) {
      this.dispatchEvent(new CustomEvent('abort'));
      alert('Game Over !!!');
      this.time = 120;
    }
  }

  stopTime() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  get clear() {
    return () => this.time = 120;
  }
}

window.customElements.define('game-timer', GameTimer);
