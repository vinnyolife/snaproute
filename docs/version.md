# version

The version module provides navigation history versioning with undo/redo support and named snapshots.

## createVersionManager()

Returns a standalone version manager.

```js
import { createVersionManager } from './src/version.js';

const vm = createVersionManager();
vm.record('/home');
vm.record('/about');
vm.record('/contact');

vm.undo();   // returns '/about'
vm.redo();   // returns '/contact'
```

## withVersion(router)

Wraps an existing router with versioning capabilities.

```js
import { createRouter } from './src/router.js';
import { withVersion } from './src/version.router.js';

const base = createRouter();
const router = withVersion(base);

router.addRoute('/home', () => 'home');
router.addRoute('/about', () => 'about');

router.navigate('/home');
router.navigate('/about');

router.canUndo(); // true
router.undo();    // { path: '/home', result: ... }
```

## Snapshots

Save and restore entire navigation state by name.

```js
router.navigate('/dashboard');
router.snapshot('pre-wizard');

router.navigate('/wizard/step-1');
router.navigate('/wizard/step-2');

router.restore('pre-wizard'); // back to /dashboard state
router.current();             // '/dashboard'
```

## API

| Method | Description |
|---|---|
| `record(path)` | Push a path into version history |
| `undo()` | Move back one step, returns previous path |
| `redo()` | Move forward one step, returns next path |
| `canUndo()` | Whether undo is available |
| `canRedo()` | Whether redo is available |
| `snapshot(label)` | Save current state under a label |
| `restore(label)` | Restore state from a saved snapshot |
| `getHistory()` | Return full history array |
| `current()` | Return the current path |
| `clear()` | Reset all state and snapshots |
