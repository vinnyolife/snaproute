/**
 * Middleware pipeline for snaproute
 * Allows chaining functions that run before route handlers
 */

export function createMiddlewarePipeline() {
  const middlewares = [];

  function use(fn) {
    if (typeof fn !== 'function') {
      throw new Error('Middleware must be a function');
    }
    middlewares.push(fn);
    return { use };
  }

  function run(context, done) {
    let index = 0;

    function next(err) {
      if (err) {
        done(err);
        return;
      }

      if (index >= middlewares.length) {
        done(null, context);
        return;
      }

      const fn = middlewares[index++];
      try {
        fn(context, next);
      } catch (e) {
        done(e);
      }
    }

    next();
  }

  function clear() {
    middlewares.length = 0;
  }

  function size() {
    return middlewares.length;
  }

  return { use, run, clear, size };
}

export function loggerMiddleware(context, next) {
  console.log(`[snaproute] navigating to: ${context.path}`);
  next();
}

export function guardMiddleware(predicate, redirectPath) {
  return function (context, next) {
    if (!predicate(context)) {
      context.redirect = redirectPath;
      next(new Error(`Guard blocked navigation to ${context.path}`));
    } else {
      next();
    }
  };
}
