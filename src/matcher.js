import { parsePattern, extractParams, parseQuery } from './params.js';

export function createMatcher() {
  const routes = [];

  function add(pattern, handler, options = {}) {
    const parsed = parsePattern(pattern);
    routes.push({ pattern, parsed, handler, options });
    return matcher;
  }

  function match(path) {
    const [pathname, search] = path.split('?');
    const query = search ? parseQuery(search) : {};

    for (const route of routes) {
      const params = extractParams(route.parsed, pathname);
      if (params !== null) {
        return {
          route,
          params,
          query,
          path: pathname,
          matched: true,
        };
      }
    }

    return { matched: false, path: pathname, query, params: {}, route: null };
  }

  function matchAll(path) {
    const [pathname, search] = path.split('?');
    const query = search ? parseQuery(search) : {};
    const results = [];

    for (const route of routes) {
      const params = extractParams(route.parsed, pathname);
      if (params !== null) {
        results.push({ route, params, query, path: pathname, matched: true });
      }
    }

    return results;
  }

  function remove(pattern) {
    const idx = routes.findIndex(r => r.pattern === pattern);
    if (idx !== -1) routes.splice(idx, 1);
    return matcher;
  }

  function clear() {
    routes.length = 0;
    return matcher;
  }

  function size() {
    return routes.length;
  }

  const matcher = { add, match, matchAll, remove, clear, size };
  return matcher;
}
