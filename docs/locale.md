# Locale Routing

`createLocaleManager` provides locale/language prefix detection and path manipulation for multi-language apps.

## Setup

```js
import { createLocaleManager } from 'snaproute/locale';

const locale = createLocaleManager({
  supported: ['en', 'fr', 'de'],
  default: 'en',
  prefixDefault: false, // don't add /en/ prefix for default locale
  fallback: true,       // use default locale when none detected
});
```

## API

### `detect(path)`
Returns the locale string if the first path segment is a supported locale, otherwise `null`.

```js
locale.detect('/fr/about'); // 'fr'
locale.detect('/about');    // null
```

### `strip(path)`
Returns `{ locale, path }` with the locale prefix removed.

```js
locale.strip('/fr/about'); // { locale: 'fr', path: '/about' }
locale.strip('/about');    // { locale: 'en', path: '/about' } (fallback)
```

### `prefix(locale, path)`
Prepends the locale to a path. Skips prefix for default locale unless `prefixDefault: true`.

```js
locale.prefix('fr', '/about'); // '/fr/about'
locale.prefix('en', '/about'); // '/about'
```

### `setCurrent(locale)` / `getCurrent()`
Get or set the active locale. Throws if the locale is not in `supported`.

### `getSupported()`
Returns a copy of the supported locales array.

## Usage with Router

```js
const router = createRouter();

router.addRoute('/about', handler);

function navigate(path) {
  const { path: stripped } = locale.strip(path);
  router.resolve(stripped);
}
```
