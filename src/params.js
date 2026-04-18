/**
 * Route parameter extraction utilities for snaproute
 */

/**
 * Convert a route pattern like '/users/:id/posts/:postId' into a regex
 * and extract named parameter keys.
 */
export function parsePattern(pattern) {
  const keys = [];
  const regexStr = pattern
    .replace(/\/:[^/]+/g, (match) => {
      keys.push(match.slice(2)); // strip '/:
      return '/([^/]+)';
    })
    .replace(/\//g, '\\/');

  return {
    regex: new RegExp(`^${regexStr}$`),
    keys,
  };
}

/**
 * Given a parsed pattern and a pathname, return an object of
 * extracted params or null if the path doesn't match.
 */
export function extractParams(parsed, pathname) {
  const { regex, keys } = parsed;
  const match = pathname.match(regex);
  if (!match) return null;

  const params = {};
  keys.forEach((key, i) => {
    params[key] = decodeURIComponent(match[i + 1]);
  });
  return params;
}

/**
 * Parse a query string (e.g. '?foo=bar&baz=1') into a plain object.
 */
export function parseQuery(search = '') {
  const query = {};
  const str = search.startsWith('?') ? search.slice(1) : search;
  if (!str) return query;

  str.split('&').forEach((pair) => {
    const [key, val = ''] = pair.split('=');
    if (key) query[decodeURIComponent(key)] = decodeURIComponent(val);
  });
  return query;
}
