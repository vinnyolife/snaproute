import { createAliasManager } from './alias.js';

/**
 * withAlias — wraps a router to resolve aliases before routing
 */
export function withAlias(router) {
  const mgr = createAliasManager();

  function addAlias(alias, canonical) {
    mgr.add(alias, canonical);
    return api;
  }

  function removeAlias(alias) {
    mgr.remove(alias);
    return api;
  }

  function resolve(path) {
    const resolved = mgr.resolve(path);
    return router.resolve(resolved);
  }

  function navigate(path, options) {
    const resolved = mgr.resolve(path);
    return router.navigate(resolved, options);
  }

  function addRoute(pattern, handler) {
    return router.addRoute(pattern, handler);
  }

  function getAliases() {
    return mgr.getAll();
  }

  const api = {
    ...router,
    addAlias,
    removeAlias,
    resolve,
    navigate,
    addRoute,
    getAliases,
  };

  return api;
}
