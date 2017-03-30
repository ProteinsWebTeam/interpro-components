InterPro web components
=======================

:warning:️ _in development_

A standard web component (v1) implementation of InterPro components.

Note: As the InterPro API is not released yet, the
`interpro-data-loader` component is not functional. In the meantime,
the rest of visual components is still usable passing data to their
attributes and/or properties.

## Usage

### Examples
```html
<interpro-type>
  <interpro-data-loader entryid="IPR011528">
</interpro-type>
```

```html
<interpro-type expanded>
 <interpro-data-loader entryid="IPR011528">
</interpro-type>
```

### Use with custom namespace

Only needed if `interpro-type` or `interpro-data-loader` names clash with an
other existing Custom Element.

```js
import {InterproDataLoader, InterproType} from 'interpro-components';

// If `data-loader` elements also namespaced, need to pass
// new name to InterproDataLoader to use it correctly
InterproDataLoader.dataLoaderElementName = 'namespaced-data-loader';

// Register the Custom Elements
customElements.define('namespaced-interpro-data-loader', InterproDataLoader);
customElements.define('namespaced-interpro-type', InterproType);
```

And then in the HTML, use like so:

```html
<namespaced-interpro-type>
  <namespaced-interpro-data-loader pdbid="1cbs">
</namespaced-interpro-type>
```

## Compatibility

This element assumes support for at least ES2015.
To support older browsers you might need to transpile the code you use
down to the version you are planning on supporting.

You might need to use a polyfill for browsers not supporting Custom
Elements **v1** (not v0).
See [webcomponents.js](https://github.com/webcomponents/webcomponentsjs) or
[SkateJS Web Components](https://github.com/skatejs/web-components).

## List of components included

### `interpro-data-loader`

_not working yet, see note at the top_

Not a visible element. Use to retrieve data from the PDB API.

Generates a `data-loader` element with the correct `source` element to
get data from the PDB API for the PDB entry specified.

### `interpro-type`

Visible element. Only displays data.

Generates the visual representation of the data passed to the `type`
property or coming from a `load` event bubbling from lower in the DOM
tree.

Visual representation can be modified from the public API of the
component (see after)

### `interpro-entry`

Visible element. Only displays data.

Generates a one line visual representation of an entry (_type_ _name_ (_accession_)).

It supports nested entries, displaying them as a subtree. 

## API

### `interpro-data-loader`

#### Properties

|name|default value|accepted values|information|DOM attribute|writable|
|----|-------------|---------------|-----------|-------------|--------|
|`entryid`|`null`|valid entry ID|string corresponding to an existing entry ID|yes|yes|

#### Events

none, but the `data-loader` component generated as its child will
dispatch bubbling events
(see [data-loader](https://github.com/aurel-l/data-loader))

#### CSS custom properties

none

### `interpro-type`

#### Properties

|name|default value|accepted values|information|DOM attribute|writable|
|----|-------------|---------------|-----------|-------------|--------|
|`type`|`'undefined'`|any of 'family', 'domain', 'repeat', 'site', 'active site', 'binding site', 'conserved site', 'ptm', or 'undefined'|corresponds to an entry type|yes|yes|
|`expanded`|`false`|boolean|expanded view of the component|yes|yes|

#### Events

none

#### CSS custom properties

none

### `interpro-entry`

#### Properties

|name|default value|accepted values|information|DOM attribute|writable|
|----|-------------|---------------|-----------|-------------|--------|
|`accession`|`null`|valid entry ID|string corresponding to an existing entry ID|yes|yes|
|`name`|`''`|valid entry ID|string corresponding to an existing entry ID|yes|yes|
|`href`|`''`|valid URL|string corresponding the URL of the entry|yes|yes|
|`type`|`'undefined'`|any of 'family', 'domain', 'repeat', 'site', 'active site', 'binding site', 'conserved site', 'ptm', or 'undefined'|corresponds to an entry type|yes|yes|
|`selected`|`false`|boolean|To show that is the current entry, and avoid links into the same page.|yes|yes|

#### Events

none

#### CSS custom properties

none

## Development and testing

1. Get the code via git clone:

   ```$ git clone https://github.com/ProteinsWebTeam/interpro-components.git```
2. Install dependencies via npm:

   ```interpro-components$ npm install```
3. Start the app. This includes re-bundling, and starts live-reload, so it refresh the page when the code changes.

   ```interpro-components$ npm run start```
4. Serve the folder. You can use a local install of apache or nginx, or alternatively just serve the local folder with a tool such as [http-server](https://www.npmjs.com/package/http-server)

   ```interpro-components$ http-server```

5. Check the test page in your server. e.g. http://localhost:8080/test/