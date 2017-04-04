import {InterproType, InterproEntry, InterproHierarchy} from './components';

if (window.customElements) {
  customElements.define('interpro-type', InterproType);
  customElements.define('interpro-entry', InterproEntry);
  customElements.define('interpro-hierarchy', InterproHierarchy);
}
