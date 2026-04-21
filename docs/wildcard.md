# Wildcard Routes

The wildcard module adds support for catch-all route patterns using `*` (single segment) and `**` (multi-segment) syntax.

## Basic Usage

```js
import { createWildcardManager } from './src/wildcard.js';

const wm = createWildcardManager();

// Match a single path segment
wm.add('/files/*', (match) => {
  console.log('File:', match.wildcard); // e.g. "readme.txt"
});

// Match any number of nested segments
wm.add('/docs/**', (match) => {
  console.log('Doc path:', match.wildcard); // e.g. "api/v2/index.html"
});

const result = wm.match('/files/notes.txt');
if (result) result.handler(result);
```

## Router Integration

Use `withWildcard` to extend an existing router with wildcard support. Wildcard routes are only checked when the base router returns `null`.

```js
import { createRouter } from './src/router.js';
import { withWildcard } from './src/wildcard.router.js';

const base = createRouter();
base.addRoute('/home', () => ({ page: 'home' }));

const router = withWildcard(base);
router.addWildcard('/assets/**', (match) => ({
  page: 'asset',
  file: match.wildcard,
}));

const result = router.resolve('/assets/img/logo.png');
// { path, pattern, wildcard: 'img/logo.png', handler }
```

## API

### `createWildcardManager()`

| Method | Description |
|---|---|
| `add(pattern, handler)` | Register a wildcard pattern |
| `remove(pattern)` | Remove a pattern |
| `match(path)` | Return first matching entry or `null` |
| `matchAll(path)` | Return all matching entries |
| `clear()` | Remove all patterns |
| `size()` | Number of registered patterns |

### Pattern Syntax

- `*` — matches a single path segment (no slashes)
- `**` — matches any number of segments including slashes
