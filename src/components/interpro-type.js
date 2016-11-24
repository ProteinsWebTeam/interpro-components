const supportedTypes = new Map([
  ['family', {full: 'Family', small: 'F', color: '#EC1D25'}],
  ['domain', {full: 'Domain', small: 'D', color: '#45B41A'}],
  ['repeat', {full: 'Repeat', small: 'R', color: '#FF830A'}],
  ['site', {full: 'Site', small: 'S', color: '#A336C6'}],
  ['active site', {full: 'Active Site', small: 'S', color: '#A336C6'}],
  ['binding site', {full: 'Binding Site', small: 'S', color: '#A336C6'}],
  ['conserved site', {full: 'Conserved Site', small: 'S', color: '#A336C6'}],
  ['ptm', {full: 'PTM', small: 'S', color: '#A336C6'}],
  ['undefined', {full: 'Undefined', small: 'U', color: '#D3C5BC'}],
]);

class InterproType extends HTMLElement {
  static get observedAttributes () {
    return ['type', 'expanded'];
  }

  _handleLoadEvent (event) {
    try {
      this.type = event.detail.metadata.type;
    } catch (err) {
      console.error(err);
    }
  }

  _render () {
    // If first render
    if (!this.shadowRoot) {
      this.attachShadow({mode: 'open'});
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
            padding: 0.2rem 0.4rem;
            border: 1px gray solid;
            border-radius: 0.2rem;
            background: ${this._type.color};
            color: white;
          "
        >
          ${this._type.small}
        </span>
        ${
          this.expanded ? `
            <span class="full"
              style="background: none; color: ${this._type.color};"
            >
              ${this._type.full}
            </span>
          ` : ''
        }
      </span>
    `.trim();
  }

  _planRender () {
    // console.log('planning rendering');
    // If rendering is already planned, skip the rest
    if (this._plannedRender) return;
    // Set a flag and _planRender at the next frame
    this._plannedRender = true;
    requestAnimationFrame(() => {
      // Removes the planned rendering flag
      this._plannedRender = false;
      this._render();
    });
  }

  // Getters/Setters
  // type
  get type () {
    return this._type.type;
  }

  set type (value) {
    const _value = value.trim().toLowerCase();
    const descriptor = supportedTypes.get(_value);
    if (!descriptor) throw new Error(`${value} is not a supported type`);
    this._type = Object.assign({type: _value}, descriptor);
    this.setAttribute('type', _value);
    this._planRender();
  }

  // expanded
  get expanded () {
    return this._expanded;
  }

  set expanded (value) {
    this._expanded = value !== null;
    if (this._expanded) {
      this.setAttribute('expanded', '');
    } else {
      this.removeAttribute('expanded');
    }
    this._planRender();
  }

  // Custom element reactions
  constructor () {
    super();
    // set defaults
    this._type = supportedTypes.get('undefined');
    this._expanded = false;
    this._handleLoadEvent = this._handleLoadEvent.bind(this);
    this._render = this._render.bind(this);
    this._planRender = this._planRender.bind(this);
  }

  connectedCallback () {
    this.addEventListener('load', this._handleLoadEvent);
  }

  disconnectedCallback () {
    this.removeEventListener('load', this._handleLoadEvent);
  }

  attributeChangedCallback (attributeName, oldValue, newValue) {
    if (oldValue === newValue) return;
    this[attributeName] = newValue;
  }
}

export default InterproType;
