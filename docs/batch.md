# Batch Navigation

The batch module lets you queue multiple route resolutions and flush them together, useful for preflight checks or deferred navigation sequences.

## createBatchManager(router)

Returns a batch manager bound to a router instance.

```js
import { createBatchManager } from './src/batch.js';
const batch = createBatchManager(router);
```

### Methods

| Method | Description |
|---|---|
| `add(path, options?)` | Queue a path for resolution |
| `flush()` | Resolve all queued paths and return results |
| `clear()` | Empty the queue |
| `size()` | Number of queued paths |
| `peek()` | Return a copy of the current queue |
| `isFlushing()` | Whether a flush is in progress |

### Options (per entry)

- `navigate` — call `router.navigate(path)` after resolving
- `stopOnError` — abort remaining entries on first error

## withBatch(router)

Higher-order wrapper that adds batch methods directly to a router.

```js
import { withBatch } from './src/batch.router.js';
const router = withBatch(createRouter());

router.queue('/dashboard').queue('/settings');
const results = await router.flushBatch({ navigateToLast: true });
```

### Additional methods

- `queue(path, options?)` — alias for `batch.add`
- `flushBatch(options?)` — flush and optionally navigate to last success
- `batchSize()` — current queue length
- `clearBatch()` — clear the queue
