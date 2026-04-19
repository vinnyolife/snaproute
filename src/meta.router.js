// withMeta — integrate meta manager with a snaproute router
import { createMetaManager } from './meta.js';

export function withMeta(router, options = {}) {
  const meta = createMetaManager();

  if (options.defaults) {
    meta.setDefaults(options.defaults);
  }

  const originalAddRoute = router.addRoute.bind(router);
  const routeMeta = new Map();

  function addRoute(pattern, handler, routeOptions = {}) {
    if (routeOptions.meta) {
      routeMeta.set(pattern, routeOptions.meta);
    }
    return originalAddRoute(pattern, handler, routeOptions);
  }

  const originalResolve = router.resolve.bind(router);

  function resolve(path) {
    const result = originalResolve(path);
    if (result && routeMeta.has(result.pattern)) {
      meta.apply(routeMeta.get(result.pattern));
    } else if (result) {
      meta.apply({});
    }
    return result;
  }

  function getMeta() {
    return meta.current();
  }

  function setDefaults(d) {
    meta.setDefaults(d);
  }

  return Object.assign({}, router, { addRoute, resolve, getMeta, setDefaults, _meta: meta });
}
