# Cache

Snaproute provides a simple in-memory cache module for storing route resolution results or any key/value data.

## createCache(options?)

```js
import { createCache } from 'snaproute/cache';

const cache = createCache({ maxSize: 100, ttl: 5000 });
```

### Options

| Option | Default | Description |
|--------|---------|-------------|
| `maxSize` | `50` | Max entries before evicting the oldest |
| `ttl` | `0` | Time-to-live in ms. `0` means no expiry |

### Methods

- `set(key, value)` — Store a value
- `get(key)` — Retrieve a value (returns `undefined` if missing or expired)
- `has(key)` — Check if a key exists and is not expired
- `remove(key)` — Delete a specific entry
- `clear()` — Remove all entries
- `size()` — Number of current entries
- `keys()` — Array of current keys

## withCache(router, options?)

Wrap an existing router to cache `resolve()` results:

```js
import { createRouter } from 'snaproute';
import { withCache } from 'snaproute/cache.router';

const router = withCache(createRouter(), { maxSize: 200, ttl: 10000 });

const match = router.resolve('/users/42'); // computed
const match2 = router.resolve('/users/42'); // from cache

router.invalidate('/users/42'); // clear one path
router.invalidate();            // clear all
console.log(router.cacheSize());
```
