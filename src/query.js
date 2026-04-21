/**
 * createQueryManager — reactive query string manager for snaproute
 * Parses, merges, and serializes URL query parameters.
 */
export function createQueryManager() {
  let _current = {};

  function parse(search = '') {
    const str = search.startsWith('?') ? search.slice(1) : search;
    if (!str) return {};
    return str.split('&').reduce((acc, pair) => {
      const [key, val] = pair.split('=').map(decodeURIComponent);
      if (!key) return acc;
      if (Object.prototype.hasOwnProperty.call(acc, key)) {
        acc[key] = [].concat(acc[key], val ?? '');
      } else {
        acc[key] = val ?? '';
      }
      return acc;
    }, {});
  }

  function stringify(params = {}) {
    const parts = [];
    for (const [key, val] of Object.entries(params)) {
      const vals = [].concat(val);
      for (const v of vals) {
        parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(v)}`);
      }
    }
    return parts.length ? '?' + parts.join('&') : '';
  }

  function set(params = {}) {
    _current = { ..._current, ...params };
  }

  function unset(...keys) {
    for (const k of keys) delete _current[k];
  }

  function get(key) {
    return key ? _current[key] : { ..._current };
  }

  function has(key) {
    return Object.prototype.hasOwnProperty.call(_current, key);
  }

  function merge(search = '') {
    _current = { ..._current, ...parse(search) };
  }

  function load(search = '') {
    _current = parse(search);
  }

  function clear() {
    _current = {};
  }

  function toSearch() {
    return stringify(_current);
  }

  return { parse, stringify, set, unset, get, has, merge, load, clear, toSearch };
}
