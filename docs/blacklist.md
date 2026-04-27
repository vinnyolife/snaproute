# Blacklist

The `createBlacklistManager` lets you block specific paths or patterns from being resolved by the router. Useful for restricting access to admin panels, maintenance pages, or any route you want to suppress entirely.

## Usage

```js
import { createBlacklistManager } from './blacklist.js';

const blacklist = createBlacklistManager();

// Block an exact path
blacklist.add('/admin');

// Block via regex
blacklist.add(/^\/internal/);

// Check before resolving
if (blacklist.isBlocked(path)) {
  return; // or redirect
}
```

## API

### `add(pathOrPattern)`
Adds a string path or `RegExp` to the blocklist. Returns the manager for chaining.

### `remove(pathOrPattern)`
Removes a previously added entry. For `RegExp`, the same reference must be used. Returns the manager for chaining.

### `isBlocked(path)`
Returns `true` if the given path matches any blocked entry or pattern.

### `clear()`
Removes all blocked entries and patterns.

### `size()`
Returns the total number of blocked entries (strings + patterns).

### `list()`
Returns an array of all blocked entries.

## Integration with router

```js
router.beforeEach((path, next) => {
  if (blacklist.isBlocked(path)) {
    console.warn(`Navigation to ${path} is blocked.`);
    return;
  }
  next();
});
```
