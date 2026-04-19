/**
 * createBasepathManager
 * Strips and prepends a base path for all route resolution.
 */
export function createBasepathManager(base = '') {
  let basepath = normalizeBase(base);

  function normalizeBase(b) {
    if (!b) return '';
    if (!b.startsWith('/')) b = '/' + b;
    return b.endsWith('/') ? b.slice(0, -1) : b;
  }

  function setBase(b) {
    basepath = normalizeBase(b);
  }

  function getBase() {
    return basepath;
  }

  function strip(path) {
    if (!basepath) return path;
    if (path.startsWith(basepath)) {
      const stripped = path.slice(basepath.length);
      return stripped.startsWith('/') ? stripped : '/' + stripped;
    }
    return path;
  }

  function prepend(path) {
    if (!basepath) return path;
    const p = path.startsWith('/') ? path : '/' + path;
    return basepath + p;
  }

  function hasBase(path) {
    if (!basepath) return true;
    return path === basepath || path.startsWith(basepath + '/');
  }

  return { setBase, getBase, strip, prepend, hasBase };
}
