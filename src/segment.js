// createSegmentManager — track and match URL segments

export function createSegmentManager() {
  const handlers = new Map();

  function register(index, handler) {
    if (typeof index !== 'number' || index < 0) {
      throw new Error('Segment index must be a non-negative number');
    }
    if (typeof handler !== 'function') {
      throw new Error('Segment handler must be a function');
    }
    handlers.set(index, handler);
  }

  function unregister(index) {
    handlers.delete(index);
  }

  function split(path) {
    return path.replace(/^\/?/, '').replace(/\/?$/, '').split('/');
  }

  function get(path, index) {
    const parts = split(path);
    return index < parts.length ? parts[index] : undefined;
  }

  function getAll(path) {
    return split(path);
  }

  function run(path) {
    const parts = split(path);
    const results = {};
    for (const [index, handler] of handlers) {
      const segment = parts[index];
      if (segment !== undefined) {
        results[index] = handler(segment, index, parts);
      }
    }
    return results;
  }

  function matches(path, index, value) {
    const segment = get(path, index);
    if (typeof value === 'string') return segment === value;
    if (value instanceof RegExp) return value.test(segment ?? '');
    if (typeof value === 'function') return value(segment);
    return false;
  }

  function count(path) {
    return split(path).filter(Boolean).length;
  }

  function clear() {
    handlers.clear();
  }

  function size() {
    return handlers.size;
  }

  return { register, unregister, get, getAll, run, matches, count, clear, size };
}
