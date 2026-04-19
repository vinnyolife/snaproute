// createLocaleRouter — locale/language prefix routing support

export function createLocaleManager(options = {}) {
  const { supported = [], default: defaultLocale = 'en', fallback = true } = options;

  let current = defaultLocale;

  function detect(path) {
    const segment = path.split('/').filter(Boolean)[0];
    return supported.includes(segment) ? segment : null;
  }

  function strip(path) {
    const locale = detect(path);
    if (locale) {
      const stripped = path.slice(locale.length + 1) || '/';
      return { locale, path: stripped };
    }
    return { locale: fallback ? defaultLocale : null, path };
  }

  function prefix(locale, path) {
    if (locale === defaultLocale && !options.prefixDefault) return path;
    const clean = path.startsWith('/') ? path : '/' + path;
    return '/' + locale + clean;
  }

  function setCurrent(locale) {
    if (!supported.includes(locale) && locale !== defaultLocale) {
      throw new Error(`Unsupported locale: ${locale}`);
    }
    current = locale;
  }

  function getCurrent() {
    return current;
  }

  function getSupported() {
    return [...supported];
  }

  return { detect, strip, prefix, setCurrent, getCurrent, getSupported };
}
