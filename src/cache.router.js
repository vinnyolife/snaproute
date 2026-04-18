// Wraps a router's resolve() with caching
import { createCache } from './cache.js';

export function withCache(router, options = {}) {
  const cache = createCache(options);

  function resolve(path) {
    if (cache.has(path)) {
      return cache.get(path);
    }
    const result = router.resolve(path);
    if (result) {
      cache.set(path, result);
    }
    return result;
  }

  function invalidate(path) {
    if (path) {
      cache.remove(path);
    } else {
      cache.clear();
    }
  }

  function cacheSize() {
    return cache.size();
  }

  return {
    ...router,
    resolve,
    invalidate,
    cacheSize,
  };
}
