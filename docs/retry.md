# Retry

The `createRetryManager` module provides automatic retry logic for failed route resolutions, with per-route configuration and exponential backoff.

## Usage

```js
import { createRetryManager } from './src/retry.js';

const retry = createRetryManager();
```

## API

### `setDefault({ max, delay })`

Set global defaults. `max` is the number of retries (default `3`), `delay` is the base delay in ms (default `100`). Backoff is exponential: `delay * 2^attempt`.

### `register(pattern, { max, delay })`

Register per-route retry config. Overrides defaults for the given pattern.

```js
retry.register('/api/data', { max: 5, delay: 200 });
```

### `unregister(pattern)`

Remove the per-route config for `pattern`.

### `getConfig(pattern)`

Returns the resolved config `{ max, delay }` for a pattern (per-route or defaults).

### `attempt(pattern, fn)`

Runs `fn` (an async function) with retry logic for `pattern`. Returns a promise that resolves with the first successful result, or rejects with the last error after all retries are exhausted.

```js
const data = await retry.attempt('/api/data', () => fetch('/api/data').then(r => r.json()));
```

### `clear()`

Removes all registered per-route configs.

### `size()`

Returns the number of registered per-route configs.

## Example

```js
retry.setDefault({ max: 3, delay: 150 });
retry.register('/flaky-route', { max: 5, delay: 50 });

const result = await retry.attempt('/flaky-route', loadFlakyRoute);
```
