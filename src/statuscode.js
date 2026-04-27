// createStatusCodeManager — map routes to HTTP-like status codes for client-side use

export function createStatusCodeManager() {
  const codes = new Map();
  const defaults = new Map([
    ['ok', 200],
    ['notFound', 404],
    ['forbidden', 403],
    ['error', 500],
    ['redirect', 301],
  ]);

  function register(route, code) {
    if (typeof code !== 'number') throw new TypeError('Status code must be a number');
    codes.set(route, code);
  }

  function unregister(route) {
    codes.delete(route);
  }

  function get(route) {
    return codes.has(route) ? codes.get(route) : null;
  }

  function getOrDefault(route, fallback = 200) {
    return codes.has(route) ? codes.get(route) : fallback;
  }

  function isOk(route) {
    const code = get(route);
    return code === null ? true : code >= 200 && code < 300;
  }

  function isError(route) {
    const code = get(route);
    return code !== null && code >= 400;
  }

  function getByCode(code) {
    const results = [];
    for (const [route, c] of codes) {
      if (c === code) results.push(route);
    }
    return results;
  }

  function getDefault(name) {
    return defaults.get(name) ?? null;
  }

  function clear() {
    codes.clear();
  }

  function size() {
    return codes.size;
  }

  function all() {
    return Object.fromEntries(codes);
  }

  return {
    register,
    unregister,
    get,
    getOrDefault,
    isOk,
    isError,
    getByCode,
    getDefault,
    clear,
    size,
    all,
  };
}
