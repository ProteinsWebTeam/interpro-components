class InterproEntry extends HTMLElement {
  static get is() {
    return 'interpro-entry';
  }

  static get observedAttributes() {
    return [
      'accession',
      'name',
      'type',
      'level',
      'selected',
      'haschildren',
      'state',
      'href',
      'includeexpander',
    ];
  }

  _handleLoadEvent(event) {
    try {
      this.accession = event.detail.payload.metadata.accession;
      this.name = event.detail.payload.metadata.name.name;
      this.type = event.detail.payload.metadata.type;
      this._planRender();
    } catch (err) {
      console.error(err);
    }
  }

  _collapseTree() {
    for (const child of this.children) {
      child.setAttribute('hidden', '');
    }
  }

  _expandTree() {
    for (const child of this.children) {
      child.removeAttribute('hidden');
    }
  }

  _handleStateChangeEvent(event) {
    if (event.target.classList.contains('expander')) {
      for (const child of this.parentElement.children) {
        child.removeAttribute('hidden');
      }
      event.target.classList.remove('expander');
      return;
    }
    switch (this._state) {
      case 'collapsed':
        this._expandTree();
        this.setAttribute('state', 'expanded');
        break;
      case 'expanded':
        this._collapseTree();
        this.setAttribute('state', 'collapsed');
        break;
    }
  }

  _render() {
    // If first render
    if (!this.shadowRoot) {
      this.attachShadow({ mode: 'open' });
    }
    if (this.querySelectorAll('interpro-entry').length > 0)
      this.setAttribute('haschildren', '');
    for (const child of this.children) {
      child.setAttribute('level', this._level + 1);
    }
    const shadowDom = this.shadyRoot || this.shadowRoot;
    const link =
      this._href || `https://www.ebi.ac.uk/interpro/entry/${this._accession}`;
    // const content = this.innerHTML;
    // this.innerHTML ="";

    shadowDom.innerHTML = `
      <style>
        .link {
          text-decoration: none;
          color: #0070bb;
        }
        .link:hover {
          color: #2199e8;
        }
        .entry-rel {
          position:relative;
          line-height: 1.6;
          display: flex;         
        }
        .entry-rel small {
          font-size: 80%;
          color: #4b555b;
          }
        .entry-rel .active {font-weight:bold; color: #4b555b}
        .entry-rel .active small {font-size:100%; color: #4b555b}
        interpro-type {margin-right:0.5rem;}
        .action-holder {      
          width: 1em; 
          height: 1em; 
          visibility: hidden;
          color: #999;
          margin-right:0.5rem;
          /*color: #222; #055d97*/
        }
        .action-holder:hover {
          color: #058db7;            
        }
        .action-holder:after {
          content: '';
          font-weight: bold;
          width: 1em;
          text-align: center;
          position: absolute;
          cursor: pointer;
          font-size: 130%;
          top:-0.3em;
        }
        .has-children, .expander {
          visibility: visible;
          /*width: 1em;*/
        }
        .has-children::after {
          content: '▾';
        }
        .expander::after {
          content: '…';
        }
        :host(.tree-hidden) .has-children::after {content: '▸';}
      </style>
      <div style="display: block; /*Firefox*/">
        <div class="entry-rel"  style="margin-left: ${this._level}rem;">
            <div class="action-holder 
                  ${this._haschildren ? 'has-children' : ''}
                  ${this._includeexpander ? 'expander' : ''}
                  " 
             ></div>
          <interpro-type type="${
            this._type
          }" dimension="1.2em"></interpro-type> 
          <span class=" ${this._selected ? 'active' : 'normal'}"
          >
              <a class="${this._selected ? '' : 'link'}" ${
      this._selected ? '' : `href="${link}"`
    }>
                   ${this._name}
               </a> <small>(${this._accession})</small>
           </span>
          
        </div>
        <div class="children">
             <slot></slot>
        </div>
      </div>
      
    `.trim();
    this.shadowRoot
      .querySelector('.action-holder')
      .addEventListener('click', this._handleStateChangeEvent);
  }

  _planRender() {
    // console.log('planning rendering');
    // If rendering is already planned, skip the rest
    if (this._plannedRender) return;
    // Set a flag and _planRender at the next frame
    this._plannedRender = true;
    // setTimeout(() => {
    requestAnimationFrame(() => {
      // Removes the planned rendering flag
      this._plannedRender = false;
      this._render();
    });
    // }, 2000);
  }

  _planUpdate() {
    this.classList.toggle('tree-hidden');
  }

  // Getters/Setters
  // accession
  get accession() {
    return this._accession;
  }

  set accession(value) {
    this._accession = value;
  }
  // name
  get name() {
    return this._name;
  }

  set name(value) {
    this._name = value;
  }
  // type
  get type() {
    return this._type;
  }

  set type(value) {
    this._type = value;
  }

  // level
  get level() {
    return this._level;
  }

  set level(value) {
    this._level = value * 1;
  }

  // selected
  get selected() {
    return this._selected;
  }

  set selected(value) {
    this._selected = value !== null;
  }

  // haschildren
  get haschildren() {
    return this._haschildren;
  }

  set haschildren(value) {
    this._haschildren = value !== null;
  }

  // includeexpander
  get includeexpander() {
    return this._includeexpander;
  }

  set includeexpander(value) {
    this._includeexpander = value !== null;
  }

  // state
  get state() {
    return this._state;
  }

  set state(value) {
    this._state = value;
  }

  // href
  get href() {
    return this._href;
  }

  set href(value) {
    this._href = value;
  }

  // Custom element reactions
  constructor() {
    super();
    // set defaults
    this._type = 'unknown';
    this._accession = '';
    this._name = '';
    this._level = 0;
    this._state = 'expanded';
    this._handleLoadEvent = this._handleLoadEvent.bind(this);
    this._handleStateChangeEvent = this._handleStateChangeEvent.bind(this);
    this._render = this._render.bind(this);
    this._planRender = this._planRender.bind(this);
    this._planUpdate = this._planUpdate.bind(this);
  }

  connectedCallback() {
    this.addEventListener('load', this._handleLoadEvent);
  }

  disconnectedCallback() {
    this.removeEventListener('load', this._handleLoadEvent);
  }

  attributeChangedCallback(attributeName, oldValue, newValue) {
    if (oldValue === newValue) return;
    this[attributeName] = newValue;
    if (attributeName !== 'state') {
      this._planRender();
      return;
    }
    this._planUpdate();
  }
}

export default InterproEntry;
