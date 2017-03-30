class InterproEntry extends HTMLElement {
  static get observedAttributes () {
    return [
      'accession', 'name', 'type', 'level', 'selected',
      'haschildren', 'state', 'href'
    ];
  }

  _handleLoadEvent (event) {
    try {
      this.accession = event.detail.metadata.accession;
      this.name = event.detail.metadata.name.name;
      this.type = event.detail.metadata.type;
    } catch (err) {
      console.error(err);
    }
  }

  _collapseTree () {
    for (const child of this.children) {
      child.setAttribute('hidden', '');
    }
  }

  _expandTree () {
    for (const child of this.children) {
      child.removeAttribute('hidden');
    }
  }

  _handleStateChangeEvent (event) {
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

  _render () {
    // If first render
    if (!this.shadowRoot) {
      this.attachShadow({mode: 'open'});
    }
    if (this.children.length > 0) this.setAttribute('haschildren', 'haschildren');
    for (const child of this.children) {
      child.setAttribute('level', this._level + 1);
    }
    const shadowDom = this.shadyRoot || this.shadowRoot;
    shadowDom.innerHTML = `
      <style>
        .link {
          text-decoration: underline;
          color: midnightblue;
          cursor: pointer;
        }
        .link:hover {
          color: royalblue;
        }
        .children {
              /*animation: fade 0.5s;*/
            transform-origin: top right;
            transform: scaleY(1);
            /*height: 100%;*/
            opacity: 1;
            transition-property: opacity, transform, max-height;
            transition-timing-function: ease;
            transition-duration: 0.2s;
        }
        :host(.hidden) .children {
          transform-origin: top right;
          transform: scaleY(0.1);
          opacity: 0;
          max-height: 0em;
          transition-duration: 0s;
        }
        .entry {
            background-color: #e0e0f0;
            position:relative;
            padding: 0.2em 10px;
            margin-bottom: 2px;
          }
        .entry:before {
          content: '';
          position: absolute;
          width: 0; 
          height: 1px; 
          border: 1.2em solid #e0e0f0;
          border-left: 0.5em solid transparent;
          border-right: 0;
          left: -0.45em;
          top: 0;
        }
        .entry:after {
          content: '';
          position: absolute;
          width: 0; 
          height: 0; 
          border: 1.2em solid transparent;
          border-left: 0.5em solid #e0e0f0;
          left:100%;
          top:0;
        }
        .action-holder {
          position: absolute;
          width: 2em; 
          height: 1em; 
          border-radius: 0.3em;
          left:3.5em;
          top: 2em;
          border:0;
          background-color: white;
          z-index: 10;
          visibility: hidden;
          color: #055d97;
        }
        .action-holder:hover {
          color: #058db7;            
          background-color: lightyellow;
        }
        .has-children {
          visibility: visible;
        }
        .has-children:after {
            content: '-';
            font-weight: bold;
            width: 2em;
            text-align: center;
            position: absolute;
            cursor: pointer;
        }
        :host(.hidden) .has-children:after {content: '+';}
      </style>
      <div style="display: inline-block;">
        <div class="entry"  style="margin-left: ${this._level}rem;">
          <interpro-type type="${this._type}"></interpro-type> 
          <span 
              style="
                font-family: 'Helvetica Neue', Verdana, sans-serif;
                font-weight: ${this._selected ? 'bold' : 'normal'}
          ">
              <a class="${this._selected ? '' : 'link'}" ${this._href ? 'href="' + this._href + '"' : ''}>
                   ${this._name}
               </a> (${this._accession})
           </span>
          
            <div 
                class="action-holder ${this._haschildren ? 'has-children' : ''}" 
             ></div>
        </div>
      </div>
      <div class="children">${this.innerHTML}</div>
      
    `.trim();
    // TODO Deal with the link
    this.shadowRoot.querySelector('.action-holder').addEventListener('click', this._handleStateChangeEvent);
  }

  _planRender () {
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

  _planUpdate () {
    this.classList.toggle('hidden');
  }

  // Getters/Setters
  // accession
  get accession () {
    return this._accession;
  }

  set accession (value) {
    this._accession = value;
  }
  // name
  get name () {
    return this._name;
  }

  set name (value) {
    this._name = value;
  }
  // type
  get type () {
    return this._type;
  }

  set type (value) {
    this._type = value;
  }
  // level
  get level () {
    return this._level;
  }

  set level (value) {
    this._level = value * 1;
  }
  get selected () {
    return this._selected;
  }

  set selected (value) {
    this._selected = value !== null;
  }
  get haschildren () {
    return this._haschildren;
  }

  set haschildren (value) {
    this._haschildren = value !== null;
  }
  get state () {
    return this._state;
  }

  set state (value) {
    this._state = value;
  }
  get href () {
    return this._href;
  }

  set href (value) {
    this._href = value;
  }

  // Custom element reactions
  constructor () {
    super();
    // set defaults
    this._type = 'undefined';
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

  connectedCallback () {
    this.addEventListener('load', this._handleLoadEvent);
  }

  disconnectedCallback () {
    this.removeEventListener('load', this._handleLoadEvent);
  }

  attributeChangedCallback (attributeName, oldValue, newValue) {
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
