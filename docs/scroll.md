# Scroll Restoration

`createScrollManager` tracks scroll positions per route, restoring them when the user navigates back.

## Usage

```js
import { createScrollManager } from 'snaproute/scroll';

const scroll = createScrollManager({ behavior: 'smooth', restoreOnBack: true });
```

## Options

| Option | Type | Default | Description |
|---|---|---|---|
| `behavior` | `string` | `'auto'` | Scroll behavior passed to `window.scrollTo` |
| `restoreOnBack` | `boolean` | `true` | Whether to restore saved positions |

## API

### `save(path)`
Saves the current `window.scrollX` / `scrollY` for the given path.

### `restore(path)`
Restores the saved scroll position for `path`, or scrolls to top if none exists.

### `scrollToTop()`
Scrolls to `(0, 0)` using the configured behavior.

### `clear(path?)`
Removes the saved position for `path`, or clears all positions if omitted.

### `has(path)`
Returns `true` if a position is saved for `path`.

### `size()`
Returns the number of saved positions.

## Example with router

```js
const scroll = createScrollManager();

router.hooks.beforeEach((from) => scroll.save(from));
router.hooks.afterEach((to) => scroll.restore(to));
```
