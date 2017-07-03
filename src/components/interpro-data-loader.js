const entryIdPattern = /^[A-Z0-9]{3,}$/;

const idToUrl = (url => id => `${url}${id}`)(
  '//www.example.com/'.trim().replace('\n', ''),
);

class InterproDataLoader extends HTMLElement {
  static get observedAttributes() {
    return ['entryid'];
  }

  _render() {
    const id = this.entryid;
    // Clean up the DOM
    const sources = this.querySelectorAll('source');
    for (const source of sources) {
      source.parentElement.removeChild(source);
    }
    // If no ID, skip
    if (!id) return;
    // We have an ID, add or modify a data-loader element to fetch the data
    const source = document.createElement('source');
    source.src = idToUrl(id);
    let dataLoader = this.querySelector(
      InterproDataLoader.dataLoaderElementName,
    );
    // If no data loader yet, create and add it
    if (!dataLoader) {
      dataLoader = document.createElement(
        InterproDataLoader.dataLoaderElementName,
      );
      dataLoader.appendChild(source);
      this.appendChild(dataLoader);
    } else {
      dataLoader.appendChild(source);
    }
  }

  _planRender() {
    // If render is already planned, skip
    if (this._plannedRender) return;
    this._plannedRender = true;
    requestAnimationFrame(() => {
      this._plannedRender = false;
      this._render();
    });
  }

  // Getters/Setters
  // entryid
  get entryid() {
    return this._entryid;
  }

  set entryid(value) {
    const _value = (value || '').trim().toUpperCase();
    if (_value && !entryIdPattern.test(_value)) {
      throw new Error(`${value} is not a valid entry ID`);
    }
    this._entryid = _value || null;
    if (this._entryid) {
      this.setAttribute('entryid', this.pdbid);
      this._planRender();
    } else {
      this.removeAttribute('entryid');
    }
  }

  // Custom element reactions
  constructor() {
    super();
    // set defaults
    this._entryid = null;
  }

  connectedCallback() {
    this._planRender();
  }

  disconnectedCallback() {
    this._plannedRender = false;
  }

  attributeChangedCallback(attributeName, oldValue, newValue) {
    if (oldValue === newValue) return;
    this[attributeName] = newValue;
  }
}
InterproDataLoader.dataLoaderElementName = 'data-loader';

export default InterproDataLoader;
