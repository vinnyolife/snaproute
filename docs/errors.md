# Error Handling

Snaproute provides structured error handling for route-level errors via `createErrorHandler`.

## Basic Usage

```js
import { createErrorHandler, createRouteError } from './errors.js';

const errors = createErrorHandler();

errors.on(404, (err, ctx) => {
  document.body.innerHTML = `<h1>404 - Page not found: ${ctx.path}</h1>`;
});

errors.on(500, (err, ctx) => {
  console.error('Server error', err);
});

errors.onFallback((err, ctx) => {
  console.warn('Unhandled error', err.statusCode, ctx);
});
```

## With Router Integration

```js
import { createRouter } from './router.js';
import { createErrorHandler } from './errors.js';
import { withErrorHandling } from './errors.router.js';

const router = createRouter();
const errors = createErrorHandler();

withErrorHandling(router, errors);

router.notFound((err, ctx) => {
  console.log('No route for', ctx.path);
});

router.onError(403, (err) => {
  window.location.href = '/login';
});
```

## createRouteError

Create structured errors to throw inside route handlers:

```js
throw createRouteError('Forbidden', 403, { redirect: '/login' });
```

## API

| Method | Description |
|---|---|
| `on(code, fn)` | Register handler for a status code |
| `onFallback(fn)` | Catch-all for unmatched errors |
| `handle(err, ctx)` | Dispatch an error to the right handler |
| `remove(code)` | Remove a handler |
| `clear()` | Remove all handlers |
| `size()` | Number of registered handlers |
