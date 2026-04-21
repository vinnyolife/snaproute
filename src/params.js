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

/**
 * Serialize a plain object into a query string (e.g. { foo: 'bar', baz: 1 } => '?foo=bar&baz=1').
 * Returns an empty string if the object has no entries.
 */
export function stringifyQuery(params = {}) {
  const pairs = Object.entries(params)
    .filter(([, val]) => val !== undefined && val !== null)
    .map(([key, val]) => `${encodeURIComponent(key)}=${encodeURIComponent(val)}`);
  return pairs.length ? `?${pairs.join('&')}` : '';
}

/**
 * Build a path string from a route pattern and a params object.
 * Replaces named segments like ':id' with the corresponding value from params.
 * Throws if a required param is missing.
 *
 * @example
 * buildPath('/users/:id/posts/:postId', { id: '42', postId: '7' })
 * // => '/users/42/posts/7'
 */
export function buildPath(pattern, params = {}) {
  return pattern.replace(/:[^/]+/g, (match) => {
    const key = match.slice(1);
    if (params[key] === undefined || params[key] === null) {
      throw new Error(`Missing required param "${key}" for pattern "${pattern}"`);
    }
    return encodeURIComponent(params[key]);
  });
}
