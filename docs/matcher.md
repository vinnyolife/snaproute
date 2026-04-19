# Matcher

The matcher module provides flexible route matching with param extraction, query parsing, and named route resolution.

## createMatcher

```js
import { createMatcher } from './matcher.js';

const matcher = createMatcher();
matcher.add('/users/:id', handler);

const result = matcher.match('/users/42?tab=info');
// { matched: true, params: { id: '42' }, query: { tab: 'info' }, ... }
```

## API

### `add(pattern, handler, options?)`
Registers a route pattern. Returns the matcher for chaining.

### `match(path)`
Returns the first matching route result:
- `matched` — boolean
- `params` — extracted path params
- `query` — parsed query string object
- `route` — the matched route entry (or `null`)

### `matchAll(path)`
Returns **all** routes that match the given path.

### `remove(pattern)`
Removes a route by pattern string.

### `clear()`
Removes all registered routes.

### `size()`
Returns the number of registered routes.

## withMatcher (router integration)

```js
import { createRouter } from './router.js';
import { withMatcher } from './matcher.router.js';

const router = withMatcher(createRouter());

router.addRoute('/posts/:slug', handler, { name: 'post' });

// Build a URL from a named route
const url = router.resolve('post', { slug: 'hello-world' });
// '/posts/hello-world'

// Check if a named route exists
router.hasNamed('post'); // true
```

Named routes make it easy to generate links without hardcoding paths.
