# Route Parameters

snaproute supports named URL parameters and query string parsing via the `params` module.

## Named Parameters

Define dynamic segments in your route pattern using `:paramName`:

```js
import { createRouter, addRoute } from './router.js';

const router = createRouter();

addRoute(router, '/users/:id', (ctx) => {
  console.log('User ID:', ctx.params.id);
});

addRoute(router, '/users/:userId/posts/:postId', (ctx) => {
  console.log(ctx.params.userId, ctx.params.postId);
});
```

## Query Strings

Query parameters are automatically parsed and available on `ctx.query`:

```js
// visiting /search?q=hello&page=2
addRoute(router, '/search', (ctx) => {
  console.log(ctx.query.q);    // 'hello'
  console.log(ctx.query.page); // '2'
});
```

## Low-level API

You can use the utilities directly if needed:

```js
import { parsePattern, extractParams, parseQuery } from './params.js';

const parsed = parsePattern('/products/:category/:id');
const params = extractParams(parsed, '/products/shoes/42');
// { category: 'shoes', id: '42' }

const query = parseQuery('?sort=asc&limit=10');
// { sort: 'asc', limit: '10' }
```

## Notes

- Parameter values are automatically URI-decoded.
- Patterns must match the full pathname (anchored start and end).
- Static segments take precedence — add them before dynamic routes.
