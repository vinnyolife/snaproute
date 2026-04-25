# Tags

Associate arbitrary string tags with routes to enable filtering, grouping, and metadata-driven navigation.

## createTagManager

```js
import { createTagManager } from 'snaproute/tags';

const tags = createTagManager();
tags.add('/home', 'public', 'nav');
tags.add('/admin', 'private');

tags.getTags('/home');        // ['public', 'nav']
tags.getRoutes('public');     // ['/home']
tags.hasTag('/home', 'nav'); // true
```

## withTags (router integration)

```js
import { createRouter } from 'snaproute';
import { withTags } from 'snaproute/tags.router';

const router = withTags(createRouter());

router.addRoute('/home', homeHandler, 'public', 'nav');
router.addRoute('/admin', adminHandler, 'private');

// Get all public routes
router.getRoutesByTag('public'); // ['/home']

// Resolve with tag metadata
router.resolveTagged('/home');
// { handler, params, tags: ['public', 'nav'] }

// Filter a set of paths
router.filterByTag(['/home', '/admin'], 'public'); // ['/home']
```

## API

### createTagManager

| Method | Description |
|---|---|
| `add(route, ...tags)` | Add tags to a route |
| `remove(route, ...tags)` | Remove specific tags from a route |
| `getTags(route)` | Get all tags for a route |
| `getRoutes(tag)` | Get all routes with a given tag |
| `hasTag(route, tag)` | Check if a route has a specific tag |
| `matchAny(route, tags)` | True if route has at least one of the given tags |
| `matchAll(route, tags)` | True if route has all of the given tags |
| `clear(route)` | Remove all tags from a route |
| `clearAll()` | Reset the entire tag registry |
| `size()` | Number of routes with tags registered |
