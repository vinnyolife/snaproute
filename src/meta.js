// createMetaManager — manage route-level meta tags (title, description, etc.)
export function createMetaManager() {
  const defaults = {};
  const stack = [];

  function setDefaults(meta) {
    Object.assign(defaults, meta);
  }

  function apply(meta = {}) {
    const merged = Object.assign({}, defaults, meta);
    stack.push(merged);

    if (merged.title !== undefined) {
      document.title = merged.title;
    }

    const tags = ['description', 'keywords', 'author', 'og:title', 'og:description'];
    for (const key of tags) {
      if (merged[key] !== undefined) {
        _setMetaTag(key, merged[key]);
      }
    }

    return merged;
  }

  function _setMetaTag(name, content) {
    const isOg = name.startsWith('og:');
    const attr = isOg ? 'property' : 'name';
    let el = document.querySelector(`meta[${attr}="${name}"]`);
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attr, name);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  }

  function current() {
    return stack.length ? stack[stack.length - 1] : Object.assign({}, defaults);
  }

  function reset() {
    stack.length = 0;
    apply(defaults);
  }

  function clear() {
    stack.length = 0;
  }

  return { setDefaults, apply, current, reset, clear };
}
