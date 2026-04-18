# Lazy Routes

Snaproute supports lazy-loaded route handlers via `createLazyRoute`. This lets you split your app into chunks and load route logic on demand.

## Usage

```js
import { createRouter, addRoute } from './router.js';
import { createLazyRoute } from './lazy.js';

const router = createRouter();

addRoute(router, '/dashboard', createLazyRoute(() => import('./routes/dashboard.js')));
```

The module loaded by the dynamic import should export the handler as its **default export**:

```js
// routes/dashboard.js
export default function dashboardHandler(context) {
  document.getElementById('app').innerHTML = '<h1>Dashboard</h1>';
}
```

## Caching

The module is loaded **once** and cached. Subsequent navigations to the same route reuse the cached handler without re-fetching.

## Prefetching

You can eagerly prefetch a lazy route before the user navigates to it:

```js
import { prefetch } from './lazy.js';

// e.g. on hover over a nav link
prefetch(() => import('./routes/dashboard.js'));
```

Prefetch failures are silently ignored so they never break the UI.

## Checking for Lazy Routes

```js
import { isLazyRoute } from './lazy.js';

isLazyRoute(handler); // true if created with createLazyRoute
```
