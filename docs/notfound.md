# Not Found Handler

Handle unmatched routes gracefully with `createNotFoundHandler`.

## Setup

```js
import { createNotFoundHandler } from './notfound.js';

const nf = createNotFoundHandler();
```

## API

### `setHandler(fn)`
Register a function to call when a route is not matched.

```js
nf.setHandler(({ path }) => {
  document.body.innerHTML = `<h1>404 — ${path} not found</h1>`;
});
```

### `setFallback(path)`
Set a redirect path to use when no handler is defined.

```js
nf.setFallback('/home');
```

### `handle(path, context?)`
Trigger the not-found flow for a given path.

```js
const result = nf.handle('/unknown');
// { notFound: true, path: '/unknown', handled: true, result: ... }
```

### `getFallback()`
Returns the configured fallback path or `null`.

### `hasHandler()`
Returns `true` if a handler has been registered.

### `clear()`
Removes the handler and fallback path.

## Integration with Router

```js
router.resolve = (path) => {
  const match = /* your matching logic */;
  if (!match) {
    const fallback = nf.getFallback();
    if (fallback) return router.navigate(fallback);
    return nf.handle(path);
  }
};
```
