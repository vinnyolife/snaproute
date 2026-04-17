# Middleware in snaproute

snaproute supports a middleware pipeline that runs before route handlers. This lets you add logging, auth guards, analytics, and more.

## Basic Usage

```js
import { createRouter } from './src/router.js';
import { loggerMiddleware, guardMiddleware } from './src/middleware.js';

const router = createRouter();

// Add built-in logger
router.use(loggerMiddleware);

// Add an auth guard
const isAuthenticated = (ctx) => !!localStorage.getItem('token');
router.use(guardMiddleware(isAuthenticated, '/login'));

router.addRoute('/dashboard', (ctx) => {
  console.log('Welcome to dashboard');
});

router.listen();
```

## Writing Custom Middleware

A middleware is a function that receives `(context, next)`.

- Call `next()` to continue to the next middleware or route handler.
- Call `next(new Error(...))` to abort the pipeline.

```js
function timingMiddleware(context, next) {
  const start = Date.now();
  next();
  console.log(`Route resolved in ${Date.now() - start}ms`);
}

router.use(timingMiddleware);
```

## Context Object

| Property   | Description                        |
|------------|------------------------------------|
| `path`     | Current URL path                   |
| `params`   | Dynamic route params (e.g. `:id`) |
| `query`    | Parsed query string object         |
| `redirect` | Set by guards to indicate redirect |

## Built-in Helpers

### `loggerMiddleware`
Logs every navigation to the console.

### `guardMiddleware(predicate, redirectPath)`
Blocks navigation if `predicate(context)` returns false and sets `context.redirect`.
