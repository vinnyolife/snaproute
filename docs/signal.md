# Signal

The signal module provides `AbortSignal`-based cancellation for in-flight navigations.

## `createSignalManager()`

Returns a manager that creates and tracks `AbortController` instances by key.

```js
import { createSignalManager } from './signal.js';

const sm = createSignalManager();
const signal = sm.create('nav');
fetch('/api/data', { signal });

// Cancel when navigating away
sm.abort('nav');
```

### Methods

| Method | Description |
|---|---|
| `create(key)` | Creates a new `AbortSignal` for `key`. Aborts any previous signal for the same key. |
| `abort(key)` | Aborts and removes the controller for `key`. Returns `true` if found. |
| `abortAll()` | Aborts and removes all tracked controllers. |
| `isAborted(key)` | Returns `true` if the signal for `key` is aborted. |
| `has(key)` | Returns `true` if a controller exists for `key`. |
| `remove(key)` | Removes the controller without aborting it. |
| `size()` | Returns the number of active controllers. |

## `withSignal(router)`

Wraps a router so every `navigate` and `resolve` call receives a fresh `AbortSignal`. Calling `navigate` again automatically aborts the previous signal.

```js
import { createRouter } from './router.js';
import { withSignal } from './signal.router.js';

const router = withSignal(createRouter());

router.navigate('/dashboard'); // starts navigation with a signal
router.navigate('/settings');  // aborts previous, starts new
router.abortNavigation();      // manually cancel
```

### Extra Methods

- `abortNavigation()` — abort the current navigation signal.
- `isNavigating()` — `true` if a non-aborted navigation signal is active.
- `getSignal()` — returns a fresh signal (replacing the current one).
