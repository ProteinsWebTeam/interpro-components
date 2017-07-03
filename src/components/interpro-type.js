const supportedTypes = new Map([
  ['family', { full: 'Family', small: 'F', color: '#EC1D25' }],
  [
    'homologous superfamily',
    { full: 'Homologous Superfamily', small: 'H', color: '#304CE3' },
  ],
  ['domain', { full: 'Domain', small: 'D', color: '#45B41A' }],
  ['repeat', { full: 'Repeat', small: 'R', color: '#FF830A' }],
  ['site', { full: 'Site', small: 'S', color: '#A336C6' }],
  ['active site', { full: 'Active Site', small: 'S', color: '#A336C6' }],
  ['binding site', { full: 'Binding Site', small: 'S', color: '#A336C6' }],
  ['conserved site', { full: 'Conserved Site', small: 'S', color: '#A336C6' }],
  ['ptm', { full: 'PTM', small: 'S', color: '#A336C6' }],
  ['unknown', { full: 'Unknown', small: 'U', color: '#D3C5BC' }],
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
      <span class="root"
        style="
          display: inline-block;
          font-family: 'Helvetica Neue', Verdana, sans-serif;
          margin: 0.1rem;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
        "
      >
        <span class="small"
          style="
            display: inline-block;
            margin: 0.1rem;
            padding: 0 0.4rem;
            border: 1px gray solid;
            border-radius: 0.2rem;
            line-height: 1.5;
            background: ${this._type.color};
            color: white;
          "
        >
          ${this._type.small}
        </span>
        ${this.expanded
          ? `
            <span class="full"
              style="background: none; color: ${this._type.color};"
            >
              ${this._type.full}
            </span>
          `
          : ''}
      </span>
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
