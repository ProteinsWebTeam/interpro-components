const supportedTypes = new Map([
  [
    'family',
    {
      full: 'Family',
      small: 'F',
      color: '#EC1D25',
      colors: ['#d41813', 'rgb(245, 69, 40)', 'rgb(212, 24, 19)'],
    },
  ],
  [
    'homologous superfamily',
    {
      full: 'Homologous Superfamily',
      small: 'H',
      color: '#304CE3',
      colors: ['#304CE3', '#405CF3', '#304CE3'],
    },
  ],
  [
    'domain',
    {
      full: 'Domain',
      small: 'D',
      color: '#45B41A',
      colors: ['#36a30f', 'rgb(80, 187, 48)', 'rgb(54, 163, 15)'],
    },
  ],
  [
    'repeat',
    {
      full: 'Repeat',
      small: 'R',
      color: '#FF830A',
      colors: ['#ff8511', '#ffa249', '#ff8511'],
    },
  ],
  [
    'site',
    {
      full: 'Site',
      small: 'S',
      color: '#A336C6',
      colors: ['#a83cc9', '#c646ec', '#a83cc9'],
    },
  ],
  [
    'active site',
    {
      full: 'Active Site',
      small: 'S',
      color: '#A336C6',
      colors: ['#a83cc9', '#c646ec', '#a83cc9'],
    },
  ],
  [
    'binding site',
    {
      full: 'Binding Site',
      small: 'S',
      color: '#A336C6',
      colors: ['#a83cc9', '#c646ec', '#a83cc9'],
    },
  ],
  [
    'conserved site',
    {
      full: 'Conserved Site',
      small: 'S',
      color: '#A336C6',
      colors: ['#a83cc9', '#c646ec', '#a83cc9'],
    },
  ],
  [
    'ptm',
    {
      full: 'PTM',
      small: 'S',
      color: '#A336C6',
      colors: ['#a83cc9', '#c646ec', '#a83cc9'],
    },
  ],
  [
    'unknown',
    {
      full: 'Unknown',
      small: 'U',
      color: '#D3C5BC',
      colors: ['#737373', '#8c8c8c', '#737373'],
    },
  ],
]);

class InterproType extends HTMLElement {
  static get is() {
    return 'interpro-type';
  }

  static get observedAttributes() {
    return ['type', 'expanded'];
  }

  _handleLoadEvent(event) {
    try {
      this.type = event.detail.payload.metadata.type;
    } catch (err) {
      console.error(err);
    }
  }

  _render() {
    // If first render
    if (!this.shadowRoot) {
      this.attachShadow({ mode: 'open' });
    }
    (this.shadyRoot || this.shadowRoot).innerHTML = `
      <style>
        div.container {
          display: -webkit-flex; /* Safari */
          -webkit-align-items: center; /* Safari 7.0+ */
          display: inline-flex;
          align-items: center;
          -webkit-justify-content:center;
          justify-content:center; 
        }
      div.container>svg {
        vertical-align: middle;
      }

      </style>
      <div class="container">
        <svg viewBox="0 0 72 72" width="${this._width}">
          <defs>
            <clipPath id="cut-off-center"><rect x="33%" y="33%" width="70" height="70"></rect></clipPath>
            <clipPath id="cut-off-bottom"><polygon points="0,68 68,0 68,68"></polygon></clipPath>
          </defs>
          <rect
            x="12" y="12"
            width="60" height="60"
            style="fill: black; opacity: 0.15"
          />
          <rect
            x="4" y="4"
            width="60" height="60"
            stroke-width="8"
            stroke="${this._type.colors[0]}"
            fill="${this._type.colors[1]}"
          />
          <polygon points="0,68 68,0 68,68" fill="${this._type.colors[2]}" />
          <text
            x="50%" y="50%"
            text-anchor="middle"
            dx="-2px" dy="20px"
            style="
              fill: white;
              font-size: 60px;
              font-weight: 700;
              font-family: 'Montserrat', 'arial', 'serif';
            "
          >
            ${this._type.small}
          </text>
          <text
            x="50%" y="50%"
            text-anchor="middle"
            dx="-2px" dy="20px"
            clip-path="url(#cut-off-bottom)"
            style="
              fill: #e6e6e6;
              font-size: 60px;
              font-weight: 700;
              font-family: 'Montserrat', 'arial', 'serif';
            "
          >
            ${this._type.small}
          </text>
        </svg>
        ${this.expanded
          ? `
            <span class="full"
              style="background: none; color: ${this._type.color};"
            >
              ${this._type.full}
            </span>
          `
          : ''}
      </div>
    `.trim();
  }

  // Getters/Setters
  // type
  get type() {
    return this._type.type;
  }

  set type(value) {
    // parse value
    const _value = value.trim().toLowerCase();
    // bail if same parsed value
    if (_value === this._type.type) return;
    // store new value
    const descriptor = supportedTypes.get(_value);
    if (!descriptor) {
      console.log(this);
      throw new Error(`${value} is not a supported type`);
    }
    this._type = Object.assign({ type: _value }, descriptor);
    // mirror attribute
    this.setAttribute('type', _value);
    this._render();
  }

  // expanded
  get expanded() {
    return this._expanded;
  }

  set expanded(value) {
    // parse value
    const _value = typeof value !== 'undefined' && value !== null;
    // bail if same parsed value
    if (_value === this._expanded) return;
    // store new value
    this._expanded = value !== null;
    // mirror attribute
    if (this._expanded) {
      this.setAttribute('expanded', '');
    } else {
      this.removeAttribute('expanded');
    }
    this._render();
  }

  // Custom element reactions
  constructor() {
    super();
    // set defaults
    this._type = supportedTypes.get('unknown');
    this._expanded = false;
    this._width = this.getAttribute('width') || '1em';
    this._handleLoadEvent = this._handleLoadEvent.bind(this);
    this._render = this._render.bind(this);
  }

  connectedCallback() {
    this.addEventListener('load', this._handleLoadEvent);
  }

  disconnectedCallback() {
    this.removeEventListener('load', this._handleLoadEvent);
  }

  attributeChangedCallback(attributeName, _, newValue) {
    this[attributeName] = newValue;
  }
}

export default InterproType;
