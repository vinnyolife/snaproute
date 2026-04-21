/**
 * createFallbackManager
 * Manages fallback routes for when no route matches.
 * Supports priority-based fallback chains and conditional fallbacks.
 */
export function createFallbackManager() {
  const fallbacks = [];
  let defaultFallback = null;

  function add(pattern, handler, options = {}) {
    const { priority = 0, condition = null } = options;
    fallbacks.push({ pattern, handler, priority, condition });
    fallbacks.sort((a, b) => b.priority - a.priority);
    return manager;
  }

  function remove(pattern) {
    const index = fallbacks.findIndex(f => f.pattern === pattern);
    if (index !== -1) fallbacks.splice(index, 1);
    return manager;
  }

  function setDefault(handler) {
    if (typeof handler !== 'function') {
      throw new TypeError('Default fallback must be a function');
    }
    defaultFallback = handler;
    return manager;
  }

  function resolve(path, context = {}) {
    for (const fallback of fallbacks) {
      if (fallback.condition && !fallback.condition(path, context)) {
        continue;
      }
      if (fallback.pattern === '*' || path.startsWith(fallback.pattern)) {
        return fallback.handler(path, context);
      }
    }
    if (defaultFallback) {
      return defaultFallback(path, context);
    }
    return null;
  }

  function has(pattern) {
    return fallbacks.some(f => f.pattern === pattern);
  }

  function clear() {
    fallbacks.length = 0;
    defaultFallback = null;
    return manager;
  }

  function size() {
    return fallbacks.length;
  }

  const manager = { add, remove, setDefault, resolve, has, clear, size };
  return manager;
}
