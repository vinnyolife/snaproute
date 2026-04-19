# Breadcrumbs

Track navigation history as a breadcrumb trail.

## Usage

```js
import { createBreadcrumbs } from './src/breadcrumbs.js';

const bc = createBreadcrumbs({ max: 10 });

bc.push({ path: '/home', label: 'Home' });
bc.push({ path: '/products', label: 'Products' });
bc.push({ path: '/products/42', label: 'Widget', meta: { id: 42 } });

console.log(bc.get());
// [
//   { path: '/home', label: 'Home', meta: {} },
//   { path: '/products', label: 'Products', meta: {} },
//   { path: '/products/42', label: 'Widget', meta: { id: 42 } }
// ]

console.log(bc.current()); // last crumb
bc.pop();                  // remove last
bc.clear();                // reset
```

## API

### `createBreadcrumbs(options?)`

| Option | Default | Description |
|--------|---------|-------------|
| `max`  | `10`    | Max crumbs to keep |

### Methods

- **`push(entry)`** — Add a crumb. `entry` must have `path`; `label` and `meta` are optional.
- **`pop()`** — Remove and return the last crumb.
- **`get()`** — Return a shallow copy of the trail.
- **`current()`** — Return the last crumb without removing it, or `null`.
- **`clear()`** — Remove all crumbs.
- **`size()`** — Return the number of crumbs.

## Integration with router

```js
const bc = createBreadcrumbs();

router.hooks.afterEach((from, to) => {
  bc.push({ path: to.path, label: to.meta?.title });
});
```
