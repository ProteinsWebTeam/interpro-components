import { expect, fixture, html } from '@open-wc/testing';

import '../src/index.js';

import { supportedTypes } from '../src/components/interpro-type';

describe('interpro-type', () => {
  // it('works', async () => {
  //   const el = await fixture(html` <interpro-type type="family"></interpro-type> `);
  //   console.log(el.shadowRoot.querySelector('.svg-container'));
  // });

  it('snapshot test-  basic', async () => {
    const el = await fixture(
      html`<interpro-type type="family"></interpro-type>`
    );
    console.warn(
      'Snapshot in @open-wc remove SVG elements, therefore this renders a very shallow snapshot'
    );
    expect(el).shadowDom.to.equalSnapshot();
  });

  it('checks snapshots for inner elements', async () => {
    for (const [entryType] of supportedTypes) {
      const el = await fixture(
        html` <interpro-type type="${entryType}"></interpro-type> `
      );
      const rect = el.shadowRoot.querySelector('.svg-container svg rect');
      const text = el.shadowRoot.querySelector('.svg-container svg text');
      expect(rect).dom.to.equalSnapshot();
      expect(text).dom.to.equalSnapshot();
    }
  });
});
