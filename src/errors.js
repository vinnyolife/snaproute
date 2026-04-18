/**
 * createErrorHandler - structured error handling for route errors
 */
export function createErrorHandler() {
  const handlers = new Map();
  let fallback = null;

  function on(statusCode, handler) {
    if (typeof statusCode !== 'number') throw new TypeError('statusCode must be a number');
    if (typeof handler !== 'function') throw new TypeError('handler must be a function');
    handlers.set(statusCode, handler);
  }

  function onFallback(handler) {
    if (typeof handler !== 'function') throw new TypeError('handler must be a function');
    fallback = handler;
  }

  function handle(error, context = {}) {
    const code = error?.statusCode ?? error?.status ?? 500;
    const matched = handlers.get(code);
    if (matched) {
      return matched(error, context);
    }
    if (fallback) {
      return fallback(error, context);
    }
    console.error('[snaproute] Unhandled route error:', error);
  }

  function remove(statusCode) {
    handlers.delete(statusCode);
  }

  function clear() {
    handlers.clear();
    fallback = null;
  }

  function size() {
    return handlers.size;
  }

  return { on, onFallback, handle, remove, clear, size };
}

export function createRouteError(message, statusCode = 500, extra = {}) {
  const err = new Error(message);
  err.statusCode = statusCode;
  Object.assign(err, extra);
  return err;
}
