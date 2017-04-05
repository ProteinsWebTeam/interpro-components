
class InterproHierarchy extends HTMLElement {
  static get observedAttributes () {
    return ['accession', 'displaymode', 'hideafter'];
  }
  _handleLoadEvent (event) {
    try {
      this._hierarchy = event.detail;
      this._planRender();
    } catch (err) {
      console.error(err);
    }
  }

  _pruneTree (node) {
    const {children, accession, name, type} = node;
    const n = {accession, name, type};
    if (accession === this._accession) {
      if (children) {
        n['children'] = children.map(
          ({accession, name, type}) => ({accession, name, type})
        );
      }
      return n;
    }
    if (children) {
      for (const child of children) {
        const prunnedChild = this._pruneTree(child);
        if (prunnedChild) n['children'] = [prunnedChild];
      }
    }
    if ('children' in n) return n;
    return false;
  }
  _moveAccessionToTop (node) {
    if (!this._accession) return false;
    if (node.accession === this._accession) return true;
    if (!node.children) return false;
    const branches = node.children.map(child => this._moveAccessionToTop(child));
    const index = branches.indexOf(true);
    if (index > 0) {
      [node.children[0], node.children[index]] = [node.children[index], node.children[0]];
    }
    return false;
  }

  _json2HTML (hierarchy, hide = false, includeExpander = false) {
    const selected = hierarchy.accession === this._accession ? 'selected' : '';
    return `
      <interpro-entry 
        accession="${hierarchy.accession}" 
        type="${hierarchy.type}" 
        name="${hierarchy.name}" ${selected}
        ${hide ? 'hidden' : ''}
        ${includeExpander ? 'includeexpander' : ''}
      >
        ${hierarchy.children ? hierarchy.children.map(
            (child, i) => this._json2HTML(child, i >= this._hideafter, i + 1 === this._hideafter)
          ).join('') : ''
        } 
      </interpro-entry>
    `;
  }
  _render () {
    // If first render
    if (!this.shadowRoot) {
      this.attachShadow({mode: 'open'});
    }
    this._moveAccessionToTop(this._hierarchy);
    let h = this._hierarchy;
    if (this._displaymode === 'pruned') h = this._pruneTree(this._hierarchy);
    const shadowDom = this.shadyRoot || this.shadowRoot;
    shadowDom.innerHTML = this._json2HTML(h).trim();
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
  constructor () {
    super();
    // set defaults
    this._displaymode = 'full';
    this._hideafter = Infinity;
    this._handleLoadEvent = this._handleLoadEvent.bind(this);
    this._json2HTML = this._json2HTML.bind(this);
    this._render = this._render.bind(this);
    this._planRender = this._planRender.bind(this);
    this._pruneTree = this._pruneTree.bind(this);
  }

  get accession () {
    return this._accession;
  }
  set accession (value) {
    this._accession = value;
  }
  get displaymode () {
    return this._displaymode;
  }
  set displaymode (value) {
    this._displaymode = value;
  }
  get hideafter () {
    return this._hideafter;
  }
  set hideafter (value) {
    this._hideafter = value * 1;
  }

  set hierarchy (value) {
    this._hierarchy = value;
    this._planRender();
  }
  connectedCallback () {
    const dataLoader = this.querySelector('data-loader');
    if (dataLoader) {
      dataLoader.addEventListener('load', this._handleLoadEvent, {once: true});
      if (dataLoader.data) {
        this._hierarchy = dataLoader.data;
        this._planRender();
      }
    }
  }

  attributeChangedCallback (attributeName, oldValue, newValue) {
    if (oldValue === newValue) return;
    this[attributeName] = newValue;
    if (this._hierarchy) {
      this._planRender();
    }
  }
}

export default InterproHierarchy;
