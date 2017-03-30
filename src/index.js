import {InterproType, InterproEntry} from './components';

if (window.customElements) {
  customElements.define('interpro-type', InterproType);
  customElements.define('interpro-entry', InterproEntry);
}
