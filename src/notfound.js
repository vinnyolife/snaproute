/**
 * createNotFoundHandler — manage 404/not-found fallback routes
 */
export function createNotFoundHandler() {
  let handler = null;
  let fallbackPath = null;

  function setHandler(fn) {
    if (typeof fn !== 'function') throw new TypeError('Handler must be a function');
    handler = fn;
  }

  function setFallback(path) {
    if (typeof path !== 'string') throw new TypeError('Fallback path must be a string');
    fallbackPath = path;
  }

  function handle(path, context = {}) {
    if (!handler) return { notFound: true, path, handled: false };
    const result = handler({ path, ...context });
    return { notFound: true, path, handled: true, result };
  }

  function getFallback() {
    return fallbackPath;
  }

  function hasHandler() {
    return handler !== null;
  }

  function clear() {
    handler = null;
    fallbackPath = null;
  }

  return { setHandler, setFallback, handle, getFallback, hasHandler, clear };
}
