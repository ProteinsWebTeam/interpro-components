InterPro web components
=======================

:warning:️ _in development_

A standard web component (v1) implementation of InterPro components.

Note: As the InterPro API is not released yet, the
`interpro-data-loader` component is using a development version of the API, and
for this reason it might unexpectedly break. The rest of visual components is
still usable passing data to their attributes and/or properties.

## Usage

### Examples
```html
<interpro-type>
  <interpro-data-loader accession="IPR011528">
</interpro-type>
```

```html
<interpro-type expanded>
 <interpro-data-loader accession="IPR011528">
</interpro-type>
```

### Use with custom namespace

Only needed if `interpro-type` or `interpro-data-loader` names clash with an
other existing Custom Element.

```js
import { InterproDataLoader, InterproType } from 'interpro-components';

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
  <namespaced-interpro-data-loader accession="IPR011528">
</namespaced-interpro-type>
```

## Compatibility

This element assumes support for at least ES2015.
To support older browsers you might need to transpile the code you use
down to the version you are planning on supporting.

You might need to use a polyfill for browsers not supporting Custom
Elements **v1** (not v0).
See [webcomponents.js](https://github.com/webcomponents/webcomponentsjs).

## List of components included

### `interpro-data-loader`

_using development endpoint, see note at the top_

Not a visible element. Use to retrieve data from the InterPro API.

Generates a `data-loader` element with the correct `source` element to
get data from the InterPro API for the specified InterPro entry.

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
|`accession`|`null`|valid entry ID|string corresponding to an existing entry ID|yes|yes|

#### Events

none, but the `data-loader` component generated as its child will
dispatch bubbling events
(see [data-loader](https://github.com/ebi-webcomponents/data-loader))

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
   
3. Start the app. This includes re-bundling, and starts live-reload, so it
refresh the page when the JavaScript code changes.

   ```interpro-components$ npm run start```

4. Check the test page in your server. e.g. http://localhost:8080/ (or whatever
address is displayed when running step 3)
