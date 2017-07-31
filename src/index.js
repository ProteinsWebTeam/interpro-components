import { InterproType, InterproEntry, InterproHierarchy } from './components';

if (window.customElements) {
  customElements.define(InterproType.is, InterproType);
  customElements.define(InterproEntry.is, InterproEntry);
  customElements.define(InterproHierarchy.is, InterproHierarchy);
}
