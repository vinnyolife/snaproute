# Events

`createEventBus` provides a lightweight pub/sub system you can attach to your router for lifecycle notifications.

## Usage

```js
import { createEventBus } from 'snaproute/events';

const events = createEventBus();

events.on('navigate', (path) => {
  console.log('navigated to', path);
});

events.emit('navigate', '/about');
```

## API

### `on(event, handler)` → unsubscribe
Register a handler. Returns a function that removes it.

### `off(event, handler)`
Remove a specific handler.

### `once(event, handler)`
Register a handler that fires only once, then auto-removes.

### `emit(event, ...args)`
Fire all handlers for an event. Errors in handlers are caught and logged.

### `clear(event?)`
Remove all handlers for a specific event, or all events if omitted.

### `size(event?)`
Return the number of handlers for an event, or total across all events.

## Example with router

```js
const events = createEventBus();

router.beforeEach((to) => {
  events.emit('routeChange', to);
});

events.on('routeChange', (path) => {
  analytics.track(path);
});
```
