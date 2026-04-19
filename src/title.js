// createTitleManager — manage document.title based on route

export function createTitleManager({ separator = ' | ', defaultTitle = '' } = {}) {
  let _separator = separator;
  let _default = defaultTitle;
  let _template = null;
  const _routeTitles = new Map();

  function setTemplate(template) {
    _template = template;
  }

  function setDefault(title) {
    _default = title;
  }

  function register(pattern, title) {
    _routeTitles.set(pattern, title);
  }

  function unregister(pattern) {
    _routeTitles.delete(pattern);
  }

  function resolve(pattern, params = {}) {
    const raw = _routeTitles.get(pattern);
    if (!raw) return _default;
    const interpolated = raw.replace(/:([a-zA-Z_]+)/g, (_, key) =>
      params[key] !== undefined ? params[key] : `:${key}`
    );
    return interpolated;
  }

  function apply(pattern, params = {}) {
    const title = resolve(pattern, params);
    if (!title) {
      document.title = _default;
      return _default;
    }
    const full = _template
      ? _template.replace('{title}', title).replace('{default}', _default)
      : _default
        ? `${title}${_separator}${_default}`
        : title;
    document.title = full;
    return full;
  }

  function current() {
    return document.title;
  }

  function clear() {
    _routeTitles.clear();
    _template = null;
    _default = defaultTitle;
  }

  return { setTemplate, setDefault, register, unregister, resolve, apply, current, clear };
}
