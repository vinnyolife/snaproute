import { createErrorHandler, createRouteError } from './errors.js';

/**
 * withErrorHandling - wraps a router's dispatch with structured error handling
 */
export function withErrorHandling(router, errorHandler) {
  const originalDispatch = router.dispatch;

  router.dispatch = async function (path) {
    try {
      const result = await originalDispatch.call(router, path);
      return result;
    } catch (err) {
      errorHandler.handle(err, { path });
    }
  };

  router.notFound = function (handler) {
    errorHandler.on(404, handler);
  };

  router.onError = function (statusCode, handler) {
    if (typeof statusCode === 'function') {
      errorHandler.onFallback(statusCode);
    } else {
      errorHandler.on(statusCode, handler);
    }
  };

  return router;
}

export { createRouteError };
