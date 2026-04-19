import { createMatcher } from './matcher.js';

/**
 * Wraps a router with enhanced matching capabilities.
 * Exposes matchAll and named-route lookup on top of the base router.
 */
export function withMatcher(router) {
  const matcher = createMatcher();
  const nameMap = new Map();

  function addRoute(pattern, handler, options = {}) {
    matcher.add(pattern, handler, options);
    if (options.name) {
      nameMap.set(options.name, pattern);
    }
    return router.addRoute(pattern, handler, options);
  }

  function matchPath(path) {
    return matcher.match(path);
  }

  function matchAllPaths(path) {
    return matcher.matchAll(path);
  }

  function resolve(name, params = {}) {
    const pattern = nameMap.get(name);
    if (!pattern) return null;
    return pattern.replace(/:([a-zA-Z_][\w]*)/g, (_, key) => {
      if (!(key in params)) throw new Error(`Missing param: ${key}`);
      return encodeURIComponent(params[key]);
    });
  }

  function hasNamed(name) {
    return nameMap.has(name);
  }

  return {
    ...router,
    addRoute,
    matchPath,
    matchAllPaths,
    resolve,
    hasNamed,
  };
}
