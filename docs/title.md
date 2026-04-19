# Title Manager

Manage `document.title` automatically based on the current route.

## Basic Usage

```js
import { createTitleManager } from './src/title.js';

const tm = createTitleManager({ separator: ' | ', defaultTitle: 'MyApp' });

tm.register('/home', 'Home');
tm.register('/users/:id', 'User :id');

tm.apply('/home');           // document.title → "Home | MyApp"
tm.apply('/users/:id', { id: '5' }); // → "User 5 | MyApp"
```

## Custom Template

```js
tm.setTemplate('{title} — {default}');
tm.apply('/home'); // → "Home — MyApp"
```

## Router Integration

```js
import { createRouter } from './src/router.js';
import { withTitle } from './src/title.router.js';

const router = withTitle(createRouter(), { defaultTitle: 'MyApp' });

router.addRoute('/about', handler, { title: 'About' });
router.addRoute('/posts/:slug', handler, { title: 'Post :slug' });

router.resolve('/about');           // sets title to "About | MyApp"
router.resolve('/posts/hello');     // sets title to "Post hello | MyApp"

router.currentTitle(); // returns current document.title
```

## API

| Method | Description |
|---|---|
| `register(pattern, title)` | Map a route pattern to a title string |
| `unregister(pattern)` | Remove a registered title |
| `resolve(pattern, params)` | Get interpolated title without applying |
| `apply(pattern, params)` | Resolve and set `document.title` |
| `setDefault(title)` | Set the default/fallback title |
| `setTemplate(template)` | Set format string using `{title}` and `{default}` |
| `current()` | Return current `document.title` |
| `clear()` | Reset all registrations and settings |
