/**
 * Route prefetching manager for snaproute
 * Allows prefetching route components/data ahead of navigation
 */

export function createPrefetchManager() {
  const prefetched = new Map();
  const pending = new Map();

  function prefetch(key, loader) {
    if (prefetched.has(key) || pending.has(key)) {
      return pending.get(key) ?? Promise.resolve(prefetched.get(key));
    }

    const promise = Promise.resolve()
      .then(() => loader())
      .then((result) => {
        prefetched.set(key, result);
        pending.delete(key);
        return result;
      })
      .catch((err) => {
        pending.delete(key);
        throw err;
      });

    pending.set(key, promise);
    return promise;
  }

  function getResult(key) {
    return prefetched.get(key) ?? null;
  }

  function isPrefetched(key) {
    return prefetched.has(key);
  }

  function isPending(key) {
    return pending.has(key);
  }

  function clear(key) {
    if (key !== undefined) {
      prefetched.delete(key);
      pending.delete(key);
    } else {
      prefetched.clear();
      pending.clear();
    }
  }

  function size() {
    return prefetched.size;
  }

  return { prefetch, getResult, isPrefetched, isPending, clear, size };
}
