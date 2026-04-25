/**
 * createScopeManager — namespace routes under a shared path prefix
 */
export function createScopeManager() {
  const scopes = new Map();

  function add(name, prefix, meta = {}) {
    if (!name || typeof name !== 'string') throw new Error('Scope name must be a non-empty string');
    if (!prefix || typeof prefix !== 'string') throw new Error('Scope prefix must be a non-empty string');
    const normalized = prefix.startsWith('/') ? prefix : '/' + prefix;
    scopes.set(name, { prefix: normalized, meta });
    return api;
  }

  function remove(name) {
    return scopes.delete(name);
  }

  function get(name) {
    return scopes.get(name) ?? null;
  }

  function has(name) {
    return scopes.has(name);
  }

  function resolve(name, path) {
    const scope = scopes.get(name);
    if (!scope) return path;
    const suffix = path.startsWith('/') ? path : '/' + path;
    return scope.prefix + suffix;
  }

  function strip(name, path) {
    const scope = scopes.get(name);
    if (!scope) return path;
    if (path.startsWith(scope.prefix)) {
      const stripped = path.slice(scope.prefix.length);
      return stripped.startsWith('/') ? stripped : '/' + stripped;
    }
    return path;
  }

  function matchScope(path) {
    for (const [name, { prefix, meta }] of scopes) {
      if (path.startsWith(prefix)) {
        return { name, prefix, meta };
      }
    }
    return null;
  }

  function list() {
    return Array.from(scopes.entries()).map(([name, data]) => ({ name, ...data }));
  }

  function clear() {
    scopes.clear();
    return api;
  }

  function size() {
    return scopes.size;
  }

  const api = { add, remove, get, has, resolve, strip, matchScope, list, clear, size };
  return api;
}
