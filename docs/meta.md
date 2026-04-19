# Meta

The `createMetaManager` module lets you manage document `<title>` and `<meta>` tags per route.

## Basic usage

```js
import { createMetaManager } from './src/meta.js';

const meta = createMetaManager();

meta.setDefaults({ title: 'MySite', description: 'A great site' });

// On navigation:
meta.apply({ title: 'About Us', description: 'Learn more about us' });
```

## API

### `setDefaults(meta)`
Set default meta values merged into every `apply()` call.

### `apply(meta)`
Merge with defaults and update the document. Supports: `title`, `description`, `keywords`, `author`, `og:title`, `og:description`.

### `current()`
Returns the last applied meta object.

### `reset()`
Clears the stack and reapplies defaults.

### `clear()`
Empties the internal stack without touching the DOM.

## Router integration

```js
import { createRouter } from './src/router.js';
import { withMeta } from './src/meta.router.js';

const base = createRouter();
const router = withMeta(base, { defaults: { title: 'MySite' } });

router.addRoute('/about', handler, {
  meta: { title: 'About — MySite', description: 'About page' }
});

router.resolve('/about');
// document.title === 'About — MySite'

console.log(router.getMeta());
// { title: 'About — MySite', description: 'About page' }
```
