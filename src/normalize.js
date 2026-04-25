/**
 * createNormalizeManager
 * Normalizes route paths: strips trailing slashes, collapses double slashes,
 * ensures leading slash, and optionally lowercases.
 */
export function createNormalizeManager(options = {}) {
  let _lowercase = options.lowercase ?? false;
  let _trailingSlash = options.trailingSlash ?? 'remove'; // 'remove' | 'add' | 'ignore'

  function setLowercase(val) {
    _lowercase = Boolean(val);
  }

  function setTrailingSlash(mode) {
    if (!['remove', 'add', 'ignore'].includes(mode)) {
      throw new Error(`Invalid trailingSlash mode: "${mode}". Use 'remove', 'add', or 'ignore'.`);
    }
    _trailingSlash = mode;
  }

  function normalize(path) {
    if (typeof path !== 'string') return '/';

    // Collapse multiple slashes (preserve leading //? -> single /)
    let result = path.replace(/\/+/g, '/');

    // Ensure leading slash
    if (!result.startsWith('/')) {
      result = '/' + result;
    }

    // Handle trailing slash
    if (_trailingSlash === 'remove') {
      if (result.length > 1) result = result.replace(/\/$/, '');
    } else if (_trailingSlash === 'add') {
      if (!result.endsWith('/')) result = result + '/';
    }
    // 'ignore' — leave as-is

    // Lowercase
    if (_lowercase) {
      result = result.toLowerCase();
    }

    return result;
  }

  function normalizeParts(path) {
    const normalized = normalize(path);
    const [pathname, ...rest] = normalized.split('?');
    const query = rest.length ? '?' + rest.join('?') : '';
    return { pathname, query, full: pathname + query };
  }

  function isSame(a, b) {
    return normalize(a) === normalize(b);
  }

  return {
    normalize,
    normalizeParts,
    isSame,
    setLowercase,
    setTrailingSlash,
    get lowercase() { return _lowercase; },
    get trailingSlash() { return _trailingSlash; },
  };
}
