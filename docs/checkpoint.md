# Checkpoint

Save and restore named navigation checkpoints — useful for multi-step flows, wizards, or "return to" navigation.

## Usage

```js
import { createCheckpointManager } from './checkpoint.js';

const cp = createCheckpointManager();

// Save the current position
cp.save('before-checkout', '/cart', { itemCount: 3 });

// Later, restore it
const point = cp.restore('before-checkout');
if (point) {
  router.navigate(point.path);
}
```

## API

### `save(name, path, state?)`
Saves a checkpoint under the given name. `state` is an optional plain object.
Returns the saved checkpoint entry.

### `restore(name)`
Returns the checkpoint entry `{ name, path, state, savedAt }` or `null` if not found.

### `has(name)`
Returns `true` if a checkpoint with that name exists.

### `remove(name)`
Deletes a checkpoint. Returns `true` on success, `false` if not found.

### `rename(oldName, newName)`
Renames an existing checkpoint. Returns `true` on success, `false` if `oldName` not found.

### `clear()`
Removes all checkpoints.

### `list()`
Returns an array of all checkpoint entries.

### `size()`
Returns the number of saved checkpoints.
