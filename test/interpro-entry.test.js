import { expect, fixture, html } from '@open-wc/testing';

import '../src/index.js';

// import {supportedTypes} from '../src/components/interpro-type';

describe('interpro-entry', () => {
  it('snapshot test', async () => {
    const el = await fixture(
      html`<interpro-entry
        accession="IPR020405"
        type="family"
        name="Test Name"
      ></interpro-entry> `
    );
    expect(el).shadowDom.to.equalSnapshot();
  });
});
