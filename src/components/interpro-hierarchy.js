class InterproHierarchy extends HTMLElement {
  static get is() {
    return 'interpro-hierarchy';
  }

  static get observedAttributes() {
    return ['accession', 'accessions', 'displaymode', 'hideafter', 'hrefroot'];
  }

  _handleLoadEvent(event) {
    try {
      this._hierarchy = event.detail.payload;
      this._planRender();
    } catch (err) {
      console.error(err);
    }
  }

  _pruneTreeMarking(node) {
    const { children, accession } = node;
    node.pruned = true;
    if (this._accessions.find(e => e === accession)) {
      node.pruned = false;
    }
    if (children) {
      for (const child of children) {
        if (!this._pruneTreeMarking(child)) node.pruned = false;
      }
    }
    return node.pruned;
  }

  _pruneTreePruning(node) {
    const { children, accession, name, type } = node;
    const n = { accession, name, type };
    if (!node.pruned) {
      if (children) {
        for (const child of children) {
          const survivor = this._pruneTreePruning(child);
          if (survivor) {
            if (!n['children']) n['children'] = [];
            n['children'].push(survivor);
          } else if (!this._displaymode.includes('no-children')) {
            if (!n['children']) n['children'] = [];
            n['children'].push({
              accession: child.accession,
              name: child.name,
              type: child.type,
            });
          }
        }
      }
      return n;
    }
    return false;
  }

  _pruneTree(node) {
    this._pruneTreeMarking(node);
    return this._pruneTreePruning(node);
  }

  _moveAccessionToTop(node) {
    if (!this._accession) return false;
    if (node.accession === this._accession) return true;
    if (!node.children) return false;
    const branches = node.children.map(child =>
      this._moveAccessionToTop(child),
    );
    const index = branches.indexOf(true);
    if (index > 0) {
      [node.children[0], node.children[index]] = [
        node.children[index],
        node.children[0],
      ];
    }
    return false;
  }

  _json2HTML(hierarchy, hide = false, includeExpander = false) {
    const selected = hierarchy.accession === this._accession ? 'selected' : '';
    return `
      <interpro-entry 
        accession="${hierarchy.accession}" 
        type="${hierarchy.type}" 
        name="${hierarchy.name}" ${selected}
        ${hide ? 'hidden' : ''}
        ${includeExpander ? 'includeexpander' : ''}
        ${this._hrefroot
          ? `href="${this._hrefroot}/${hierarchy.accession}"`
          : ''}
      >
        ${hierarchy.children
          ? hierarchy.children
              .map((child, i) =>
                this._json2HTML(
                  child,
                  i >= this._hideafter,
                  i + 1 === this._hideafter &&
                    hierarchy.children.length > i + 1,
                ),
              )
              .join('')
          : ''} 
      </interpro-entry>
    `;
  }

  _render() {
    // If first render
    if (!this.shadowRoot) {
      this.attachShadow({ mode: 'open' });
    }
    this._moveAccessionToTop(this._hierarchy);
    let h = this._hierarchy;
    if (this._displaymode.includes('pruned')) {
      h = Array.isArray(h)
        ? h.map(n => this._pruneTree(n))
        : this._pruneTree(this._hierarchy);
    }
    const shadowDom = this.shadyRoot || this.shadowRoot;
    shadowDom.innerHTML = Array.isArray(h)
      ? h.map(n => this._json2HTML(n).trim()).join('')
      : this._json2HTML(h).trim();
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

  constructor() {
    super();
    // set defaults
    this._displaymode = 'full';
    this._hideafter = Infinity;
    this._hrefroot = null;
    this._handleLoadEvent = this._handleLoadEvent.bind(this);
    this._json2HTML = this._json2HTML.bind(this);
    this._render = this._render.bind(this);
    this._planRender = this._planRender.bind(this);
    this._pruneTree = this._pruneTree.bind(this);
  }

  get accession() {
    return this._accession;
  }
  set accession(value) {
    this._accession = value;
  }

  get accessions() {
    return this._accessions;
  }
  set accessions(value) {
    this._accessions = Array.isArray(value) ? value : value.split(',');
  }

  get hrefroot() {
    return this._hrefroot;
  }
  set hrefroot(value) {
    this._hrefroot = value;
  }

  get displaymode() {
    return this._displaymode;
  }
  set displaymode(value) {
    this._displaymode = value;
  }

  get hideafter() {
    return this._hideafter;
  }
  set hideafter(value) {
    this._hideafter = value * 1;
  }

  set hierarchy(value) {
    this._hierarchy = value;
    this._planRender();
  }

  connectedCallback() {
    const dataLoader = this.querySelector('data-loader');
    if (dataLoader) {
      dataLoader.addEventListener('load', this._handleLoadEvent, {
        once: true,
      });
      if (dataLoader.data) {
        this._hierarchy = dataLoader.data;
        this._planRender();
      }
    }
  }

  attributeChangedCallback(attributeName, oldValue, newValue) {
    if (oldValue === newValue) return;
    this[attributeName] = newValue;
    if (this._hierarchy) {
      this._planRender();
    }
  }
}

export default InterproHierarchy;
