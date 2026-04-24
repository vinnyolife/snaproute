# Alias

Map one or more route paths to a canonical destination without adding redirect overhead.

## createAliasManager

```js
import { createAliasManager } from 'snaproute/alias';

const aliases = createAliasManager();
aliases.add('/old-page', '/new-page');

aliases.resolve('/old-page'); // '/new-page'
aliases.resolve('/other');    // '/other' (unchanged)
```

## Wildcard prefix aliases

Append `*` to both sides to forward a whole path subtree:

```js
aliases.add('/v1/*', '/v2/*');
aliases.resolve('/v1/users/42'); // '/v2/users/42'
```

Or point a whole subtree at a single destination:

```js
aliases.add('/legacy/*', '/home');
aliases.resolve('/legacy/anything'); // '/home'
```

## withAlias (router integration)

```js
import { createRouter } from 'snaproute';
import { withAlias } from 'snaproute/alias.router';

const router = withAlias(createRouter());

router.addAlias('/about-us', '/about');
router.addRoute('/about', () => 'About page');

router.resolve('/about-us'); // runs '/about' handler
router.navigate('/about-us'); // navigates to '/about'
```

## API

| Method | Description |
|---|---|
| `add(alias, canonical)` | Register an alias |
| `remove(alias)` | Unregister an alias |
| `resolve(path)` | Return canonical path (or original if no match) |
| `has(alias)` | Check if alias is registered |
| `getAll()` | Return all alias → canonical mappings |
| `clear()` | Remove all aliases |
| `size()` | Number of registered aliases |
