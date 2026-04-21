/**
 * createWildcardManager
 * Supports wildcard route patterns like /files/* or /docs/**
 */
export function createWildcardManager() {
  const wildcards = new Map();

  function add(pattern, handler) {
    if (typeof pattern !== 'string') throw new TypeError('pattern must be a string');
    if (typeof handler !== 'function') throw new TypeError('handler must be a function');
    wildcards.set(pattern, { pattern, handler, regex: toRegex(pattern) });
    return api;
  }

  function remove(pattern) {
    wildcards.delete(pattern);
    return api;
  }

  function match(path) {
    for (const [, entry] of wildcards) {
      const m = entry.regex.exec(path);
      if (m) {
        return {
          pattern: entry.pattern,
          handler: entry.handler,
          wildcard: m[1] ?? '',
          path,
        };
      }
    }
    return null;
  }

  function matchAll(path) {
    const results = [];
    for (const [, entry] of wildcards) {
      const m = entry.regex.exec(path);
      if (m) {
        results.push({
          pattern: entry.pattern,
          handler: entry.handler,
          wildcard: m[1] ?? '',
          path,
        });
      }
    }
    return results;
  }

  function clear() {
    wildcards.clear();
    return api;
  }

  function size() {
    return wildcards.size;
  }

  function toRegex(pattern) {
    // ** matches anything including slashes, * matches a single segment
    const escaped = pattern
      .replace(/[.+?^${}()|[\]\\]/g, '\\$&')
      .replace(/\*\*/g, '(.+)')
      .replace(/\*/g, '([^/]*)');
    return new RegExp('^' + escaped + '(?:/.*)?$');
  }

  const api = { add, remove, match, matchAll, clear, size };
  return api;
}
