# Route Lifecycle Hooks

Snaproute provides lifecycle hooks to run logic before and after navigation, and to handle errors.

## Setup

```js
import { createHooks } from './src/hooks.js';

const hooks = createHooks();
```

## `beforeEach(fn)`

Runs before every route change. Return `false` to cancel navigation.

```js
hooks.beforeEach((to, from) => {
  if (to === '/admin' && !isLoggedIn()) {
    return false; // block navigation
  }
});
```

## `afterEach(fn)`

Runs after every successful navigation.

```js
hooks.afterEach((to, from) => {
  console.log(`Navigated from ${from} to ${to}`);
});
```

## `onError(fn)`

Called when an error is thrown during navigation.

```js
hooks.onError((err, to, from) => {
  console.error(`Navigation to ${to} failed:`, err);
});
```

## Unsubscribing

Each hook registration returns an unsubscribe function:

```js
const unsub = hooks.beforeEach(myGuard);
unsub(); // remove the hook
```

## `clear()`

Removes all registered hooks:

```js
hooks.clear();
```
