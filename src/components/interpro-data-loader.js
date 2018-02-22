const accessionPattern = /^IPR\d{6}$/;

const accessionToUrl = (url => accession =>
  url.replace('{accession}', accession))(
  'https://wwwdev.ebi.ac.uk/interpro7/api/entry/InterPro/{accession}/',
);

class InterproDataLoader extends HTMLElement {
  static get is() {
    return 'interpro-data-loader';
  }

  static get observedAttributes() {
    return ['accession'];
  }

  static get dataLoaderElementName() {
    return 'data-loader';
  }

  _render() {
    const id = this.accession;
    // Clean up the DOM
    const sources = this.querySelectorAll('source');
    for (const source of sources) {
      source.parentElement.removeChild(source);
    }
    // If no ID, skip
    if (!id) return;
    // We have an ID, add or modify a data-loader element to fetch the data
    const source = document.createElement('source');
    source.src = accessionToUrl(id);
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
  get accession() {
    return this._accession;
  }

  set accession(value) {
    const _value = (value || '').trim().toUpperCase();
    if (_value && !accessionPattern.test(_value)) {
      throw new Error(`${value} is not a valid entry accession`);
    }
    this._accession = _value || null;
    if (this._accession) {
      this.setAttribute('accession', this.accession);
      this._planRender();
    } else {
      this.removeAttribute('accession');
    }
  }

  // Custom element reactions
  constructor() {
    super();
    // set defaults
    this._accession = null;
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

export default InterproDataLoader;
