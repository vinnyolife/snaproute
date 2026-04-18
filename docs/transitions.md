# Transitions

The `createTransitions` module lets you define named enter/leave animations or async side-effects that fire during route changes.

## Basic Usage

```js
import { createTransitions } from './src/transitions.js';

const transitions = createTransitions();

transitions.define('fade', {
  enter: async (ctx) => {
    document.body.classList.add('fade-in');
    await wait(300);
    document.body.classList.remove('fade-in');
  },
  leave: async (ctx) => {
    document.body.classList.add('fade-out');
    await wait(300);
    document.body.classList.remove('fade-out');
  },
});
```

## API

### `define(name, { enter, leave })`
Registers a named transition. Both `enter` and `leave` are optional async functions receiving a context object.

### `run(name, phase, context)`
Runs a single phase (`'enter'` or `'leave'`) of a named transition.

### `between(fromName, toName, context)`
Convenience method: runs `leave` on `fromName` then `enter` on `toName`. Ideal for wiring into router navigation.

```js
router.hooks.beforeEach(async (ctx) => {
  await transitions.between(ctx.from?.transition, ctx.to?.transition, ctx);
});
```

### `get(name)` → transition object or `null`

### `remove(name)` — unregisters a transition

### `clear()` — removes all transitions

### `list()` → `string[]` of registered names
