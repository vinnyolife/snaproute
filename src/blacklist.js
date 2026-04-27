/**
 * createBlacklistManager — block specific paths from being routed
 */
export function createBlacklistManager() {
  const entries = new Set();
  const patterns = [];

  function add(pathOrPattern) {
    if (pathOrPattern instanceof RegExp) {
      patterns.push(pathOrPattern);
    } else {
      entries.add(pathOrPattern);
    }
    return api;
  }

  function remove(pathOrPattern) {
    if (pathOrPattern instanceof RegExp) {
      const idx = patterns.indexOf(pathOrPattern);
      if (idx !== -1) patterns.splice(idx, 1);
    } else {
      entries.delete(pathOrPattern);
    }
    return api;
  }

  function isBlocked(path) {
    if (entries.has(path)) return true;
    return patterns.some((re) => re.test(path));
  }

  function clear() {
    entries.clear();
    patterns.length = 0;
    return api;
  }

  function size() {
    return entries.size + patterns.length;
  }

  function list() {
    return [...entries, ...patterns];
  }

  const api = { add, remove, isBlocked, clear, size, list };
  return api;
}
