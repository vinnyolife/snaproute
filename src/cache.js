// Route result cache with TTL and max size support
export function createCache({ maxSize = 50, ttl = 0 } = {}) {
  const store = new Map();

  function set(key, value) {
    if (store.size >= maxSize) {
      const firstKey = store.keys().next().value;
      store.delete(firstKey);
    }
    store.set(key, {
      value,
      expires: ttl > 0 ? Date.now() + ttl : 0,
    });
  }

  function get(key) {
    const entry = store.get(key);
    if (!entry) return undefined;
    if (entry.expires && Date.now() > entry.expires) {
      store.delete(key);
      return undefined;
    }
    return entry.value;
  }

  function has(key) {
    return get(key) !== undefined;
  }

  function remove(key) {
    store.delete(key);
  }

  function clear() {
    store.clear();
  }

  function size() {
    return store.size;
  }

  function keys() {
    return Array.from(store.keys());
  }

  return { set, get, has, remove, clear, size, keys };
}
