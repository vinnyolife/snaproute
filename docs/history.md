# History

The `createHistory` module wraps the HTML5 History API, providing a clean interface for navigation and change detection.

## Usage

```js
import { createHistory } from './src/history.js';

const history = createHistory();

// Listen for route changes (push, replace, or browser back/forward)
const unlisten = history.listen(({ path, state }) => {
  console.log('Navigated to:', path, state);
});

// Navigate programmatically
history.push('/about');
history.push('/profile', { userId: 42 });

// Replace current entry without adding to history stack
history.replace('/login');

// Browser-native back/forward
history.back();
history.forward();

// Get current path
console.log(history.getCurrentPath()); // e.g. '/about?ref=nav'

// Stop listening
unlisten();

// Tear down all listeners
history.destroy();
```

## API

| Method | Description |
|---|---|
| `getCurrentPath()` | Returns current `pathname + search + hash` |
| `push(path, state?)` | Pushes a new entry onto the history stack |
| `replace(path, state?)` | Replaces the current history entry |
| `back()` | Goes back one step |
| `forward()` | Goes forward one step |
| `listen(fn)` | Registers a navigation listener, returns unlisten function |
| `destroy()` | Removes all registered listeners |

## Integration with snaproute

```js
import { createRouter } from './src/router.js';
import { createHistory } from './src/history.js';

const history = createHistory();
const router = createRouter();

history.listen(({ path }) => router.resolve(path));
```
