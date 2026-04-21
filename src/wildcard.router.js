import { createWildcardManager } from './wildcard.js';

/**
 * withWildcard
 * Wraps a router to add wildcard route support.
 * Wildcard routes are checked when normal resolve returns null.
 */
export function withWildcard(router) {
  const wm = createWildcardManager();

  function addWildcard(pattern, handler) {
    wm.add(pattern, handler);
    return api;
  }

  function removeWildcard(pattern) {
    wm.remove(pattern);
    return api;
  }

  function resolve(path) {
    const base = router.resolve(path);
    if (base !== null && base !== undefined) return base;

    const hit = wm.match(path);
    if (!hit) return null;

    return {
      path,
      pattern: hit.pattern,
      wildcard: hit.wildcard,
      handler: hit.handler,
    };
  }

  function navigate(path) {
    return router.navigate(path);
  }

  function wildcardSize() {
    return wm.size();
  }

  const api = {
    ...router,
    addWildcard,
    removeWildcard,
    resolve,
    navigate,
    wildcardSize,
  };

  return api;
}
