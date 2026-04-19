# Redirect

The redirect module lets you define client-side redirects that are applied automatically during navigation.

## createRedirectManager

```js
import { createRedirectManager } from './src/redirect.js';

const redirects = createRedirectManager();

// Static redirect
redirects.add('/old-path', '/new-path');

// Permanent redirect
redirects.add('/gone', '/replacement', { permanent: true });

// Dynamic redirect using a function
redirects.add('/legacy', (path) => path.replace('/legacy', '/v2'));
```

## API

### `add(from, to, options?)`
Registers a redirect from `from` to `to`. `to` can be a string or a function `(path) => string`.
- `options.permanent` (boolean, default `false`) — marks the redirect as permanent.

### `resolve(path)`
Returns `{ to, permanent }` if a redirect exists, otherwise `null`.

### `has(path)`
Returns `true` if a redirect is registered for `path`.

### `remove(path)`
Removes the redirect for `path`.

### `clear()`
Removes all redirects.

### `size()`
Returns the number of registered redirects.

## withRedirects

Wraps a router instance so that `navigate` automatically follows registered redirects.

```js
import { withRedirects } from './src/redirect.js';
import { createRouter } from './src/router.js';

const router = withRedirects(createRouter(), redirects);

router.navigate('/old-path'); // navigates to /new-path
```
