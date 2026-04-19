# Analytics

Track route visits and navigation timing with `createAnalytics`.

## Setup

```js
import { createAnalytics } from './src/analytics.js';

const analytics = createAnalytics();
```

## Tracking navigations

Call `trackStart` before resolving a route and `trackEnd` after to capture duration:

```js
analytics.trackStart('/users/42');
// ... resolve route ...
analytics.trackEnd('/users/42', { id: '42' });
```

If you only call `trackEnd`, the entry is still recorded but `duration` will be `null`.

## Custom adapter

Send data to any analytics service:

```js
analytics.setAdapter((entry) => {
  fetch('/api/analytics', {
    method: 'POST',
    body: JSON.stringify(entry),
  });
});
```

Each `entry` contains:

| Field | Type | Description |
|-------|------|-------------|
| `path` | string | Matched path |
| `params` | object | Route params |
| `duration` | number\|null | ms from trackStart to trackEnd |
| `timestamp` | number | Unix ms when trackEnd was called |

## API

### `setAdapter(fn)`
Register a callback invoked after every `trackEnd`. Errors inside the adapter are silently swallowed so they never break navigation.

### `trackStart(path)`
Mark the beginning of a navigation to `path`.

### `trackEnd(path, params?)`
Finalize tracking and store the entry. Returns the entry object.

### `getEntries()`
Returns a shallow copy of all recorded entries.

### `getLast()`
Returns the most recent entry, or `null`.

### `clear()`
Removes all entries and resets pending start.

### `size()`
Returns the number of recorded entries.
