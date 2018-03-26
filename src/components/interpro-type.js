import { html, svg, render } from 'lit-html';

const supportedTypes = new Map([
  [
    'family',
    {
      full: 'Family',
      small: 'F',
      // color: '#EC1D25',
      color: '#ec7865',
      colors: [
        '#ec7865',
        '#fb5d43',
        'rgb(212, 24, 19)',
      ] /*color icon - color text -?*/,
    },
  ],
  [
    'homologous superfamily',
    {
      full: 'Homologous Superfamily',
      small: 'H',
      // color: '#304CE3',
      color: '#6caed4',
      colors: ['#6caed4', '#5093ba', '#304CE3'],
    },
  ],
  [
    'domain',
    {
      full: 'Domain',
      small: 'D',
      // color: '#45B41A',
      color: '#70c770',
      colors: ['#70c770', 'rgb(80, 187, 48)', 'rgb(54, 163, 15)'],
    },
  ],
  [
    'repeat',
    {
      full: 'Repeat',
      small: 'R',
      // color: '#FF830A',
      color: '#ffa970',
      colors: ['#ffa970', '#efa55f', '#ff8511'],
    },
  ],
  [
    'site',
    {
      full: 'Site',
      small: 'S',
      // color: '#A336C6' '#d09ad0',
      color: '#ce94ce',
      colors: ['#ce94ce', '#bb71bb', '#a83cc9'],
    },
  ],
  [
    'active site',
    {
      full: 'Active Site',
      small: 'S',
      // color: '#A336C6',
      color: '#ce94ce',
      colors: ['#ce94ce', '#bb71bb', '#a83cc9'],
    },
  ],
  [
    'binding site',
    {
      full: 'Binding Site',
      small: 'S',
      // color: '#A336C6',
      color: '#ce94ce',
      colors: ['#ce94ce', '#bb71bb', '#a83cc9'],
    },
  ],
  [
    'conserved site',
    {
      full: 'Conserved Site',
      small: 'S',
      // color: '#A336C6',
      color: '#ce94ce',
      colors: ['#ce94ce', '#bb71bb', '#a83cc9'],
    },
  ],
  [
    'ptm',
    {
      full: 'PTM',
      small: 'S',
      // color: '#A336C6',
      color: '#ce94ce',
      colors: ['#ce94ce', '#bb71bb', '#a83cc9'],
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

const svgTemplate = (fillColor, small) => svg`
  <rect
    x="0" y="0"
    width="60" height="60"          
    fill="${fillColor}"
  />
  <text
    x="50%" y="50%"
    text-anchor="middle"
    dx="0" dy="18px"
    style="
      fill: white;
      font-size: 50px;
      font-weight: 700;
      font-family: 'Montserrat', 'arial', 'serif';
    "
  >
    ${small}
  </text>
`;

const typeTemplate = (
  size,
  expanded,
  small,
  full,
  fillColor,
  textColor,
) => html`
  <style>
    .svg-container {
      display: inline-flex;
      align-items:center;
    }      
  </style>
  <span class="svg-container">
    <svg viewBox="0 0 60 60" width="${size}" height="${size}">
      ${svgTemplate(fillColor, small)}
    </svg>
    ${
      expanded
        ? html`<span style="color: ${textColor};">&nbsp;${full}</span>`
        : ''
    }
  </span>
`;

class InterproType extends HTMLElement {
  static get is() {
    return 'interpro-type';
  }

  static get observedAttributes() {
    return ['type', 'size', 'expanded'];
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
    render(
      typeTemplate(
        this._size,
        this.expanded,
        this._type.small,
        this._type.full,
        this._type.colors[0],
        this._type.colors[1],
      ),
      this.shadyRoot || this.shadowRoot,
    );
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
    this.setAttribute('aria-label', `InterPro type: ${_value}`);
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

  // size
  get size() {
    return this._size;
  }

  set size(value) {
    // bail if same parsed value
    if (value === this._size) return;
    // store new value
    this._size = value;
    // mirror attribute
    this.setAttribute('size', value);
    this._render();
  }

  // Custom element reactions
  constructor() {
    super();
    // set defaults
    this._type = supportedTypes.get('unknown');
    this._expanded = false;
    this._size = this.getAttribute('size') || getComputedStyle(this).lineHeight;
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
