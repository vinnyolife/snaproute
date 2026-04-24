import { createPriorityManager } from './priority.js';

/**
 * withPriority — wraps a router to resolve routes in priority order
 */
export function withPriority(router) {
  const pm = createPriorityManager();
  const _routes = [];

  function addRoute(pattern, handler, priority = 0) {
    pm.set(pattern, priority);
    _routes.push({ pattern, handler });
    router.addRoute(pattern, handler);
  }

  function resolve(path) {
    const sorted = pm.sortRoutes(_routes);
    for (const route of sorted) {
      const result = router.resolve(path, route.pattern);
      if (result) return result;
    }
    return null;
  }

  function setPriority(pattern, priority) {
    pm.set(pattern, priority);
  }

  function getPriority(pattern) {
    return pm.get(pattern);
  }

  function listRoutes() {
    return pm.sortRoutes(_routes).map(r => ({
      pattern: r.pattern,
      priority: pm.get(r.pattern),
    }));
  }

  return {
    ...router,
    addRoute,
    resolve,
    setPriority,
    getPriority,
    listRoutes,
  };
}
