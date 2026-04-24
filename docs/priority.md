# Priority

The priority module lets you assign numeric priorities to routes so that when multiple routes could match a path, the highest-priority route wins.

## createPriorityManager

```js
import { createPriorityManager } from './src/priority.js';

const pm = createPriorityManager();

pm.set('/admin', 20);
pm.set('/home', 5);
pm.set('*', 0);

// Sort an array of pattern strings
const sorted = pm.sort(['/home', '/admin', '*']);
// => ['/admin', '/home', '*']

// Sort an array of route objects
const routes = [
  { pattern: '*' },
  { pattern: '/admin' },
  { pattern: '/home' },
];
const sortedRoutes = pm.sortRoutes(routes);
// => [{ pattern: '/admin' }, { pattern: '/home' }, { pattern: '*' }]
```

## withPriority(router)

Wraps an existing router so that `addRoute` accepts an optional third `priority` argument, and `resolve` evaluates routes in priority order.

```js
import { createRouter } from './src/router.js';
import { withPriority } from './src/priority.router.js';

const router = withPriority(createRouter());

router.addRoute('*',      () => 'catch-all', 0);
router.addRoute('/home',  () => 'home page', 10);
router.addRoute('/admin', () => 'admin',     20);

router.resolve('/admin'); // matches /admin (priority 20)
router.resolve('/other'); // matches *      (priority 0)
```

### API

| Method | Description |
|---|---|
| `addRoute(pattern, handler, priority?)` | Register a route with an optional priority (default `0`) |
| `resolve(path)` | Resolve a path against routes sorted by descending priority |
| `setPriority(pattern, priority)` | Update the priority of an existing route |
| `getPriority(pattern)` | Get the current priority (returns `0` if not set) |
| `listRoutes()` | Return all routes sorted by priority with their priority values |
