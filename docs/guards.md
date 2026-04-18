# Route Guards

Route guards let you intercept navigation and decide whether to allow, block, or redirect it.

## Setup

```js
import { createGuards } from './src/guards.js';

const guards = createGuards();
```

## Adding a Guard

```js
const unregister = guards.add(async (from, to) => {
  const loggedIn = await checkAuth();
  if (!loggedIn && to.startsWith('/dashboard')) {
    return '/login'; // redirect
  }
  // return nothing / undefined to allow
});

// Remove later
unregister();
```

## Guard Return Values

| Return value | Effect |
|---|---|
| `undefined` / `true` | Navigation allowed |
| `false` | Navigation blocked |
| `'/path'` (string) | Redirect to that path |
| throws | Navigation blocked, error captured |

## Running Guards

```js
const result = await guards.run(fromPath, toPath);

if (!result.allowed) {
  if (result.redirect) {
    navigate(result.redirect);
  } else {
    console.warn('Navigation blocked', result.reason);
  }
}
```

## API

- `add(fn)` — register a guard, returns an unregister function
- `remove(fn)` — unregister a specific guard
- `run(from, to)` — execute all guards in order, returns a result object
- `clear()` — remove all guards
- `size()` — number of registered guards
