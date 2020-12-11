import { expect, fixture, html } from '@open-wc/testing';

import '../src/index.js';
import 'data-loader/dist/data-loader.js';

// import {supportedTypes} from '../src/components/interpro-type';
const hierarchyJSON = {
  accession: 'IPR024178',
  name: 'Oestrogen receptor/oestrogen-related receptor',
  type: 'Family',
  children: [
    {
      accession: 'IPR001292',
      name: 'Oestrogen receptor',
      type: 'Family',
    },
    {
      accession: 'ipr028355',
      name: 'Estrogen receptor beta/gamma',
      type: 'Family',
    },
    {
      accession: 'IPR027289',
      name: 'Oestrogen-related receptor',
      type: 'Family',
    },
  ],
};

describe('interpro-hierarchy', () => {
  it('snapshot test', async () => {
    const el = await fixture(html`<interpro-hierarchy>
      <data-loader>
        <script type="application/json">
          ${JSON.stringify(hierarchyJSON)}
        </script>
      </data-loader>
    </interpro-hierarchy> `);
    // console.log(el.shadowRoot);
    expect(el).shadowDom.to.equalSnapshot();
  });
});
