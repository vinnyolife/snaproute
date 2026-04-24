# Route Groups

Group related routes under a shared prefix, metadata, and guards.

## Usage

```js
import { createGroupManager } from './src/groups.js';

const groups = createGroupManager();

groups.add('admin', {
  prefix: '/admin',
  meta: { requiresAuth: true, role: 'admin' },
  guards: [authGuard],
});

// Build a full path within the group
const path = groups.applyGroup('admin', '/dashboard'); // '/admin/dashboard'

// Read shared meta
const meta = groups.getMeta('admin'); // { requiresAuth: true, role: 'admin' }

// Read shared guards
const guards = groups.getGuards('admin'); // [authGuard]
```

## API

### `createGroupManager()`
Returns a new group manager instance.

### `add(name, options)`
Registers a new group. Throws if the name is already taken.

| Option | Type | Description |
|--------|------|-------------|
| `prefix` | `string` | URL prefix applied to all routes in the group |
| `meta` | `object` | Shared metadata merged into route meta |
| `guards` | `function[]` | Guards run before any route in the group |

### `remove(name)`
Removes a group by name. Returns `true` if it existed.

### `get(name)`
Returns a copy of the group config, or `null` if not found.

### `has(name)`
Returns `true` if the group exists.

### `applyGroup(name, path)`
Prepends the group prefix to `path`. Normalises duplicate slashes.

### `getMeta(name)`
Returns the group's shared meta object (empty object if not found).

### `getGuards(name)`
Returns a copy of the group's guard array (empty array if not found).

### `clear()`
Removes all groups. Returns the manager for chaining.

### `size()`
Returns the number of registered groups.
