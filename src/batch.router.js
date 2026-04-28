import { createBatchManager } from './batch.js';

// withBatch — wraps a router with batch navigation support
export function withBatch(router) {
  const batch = createBatchManager(router);

  function addRoute(pattern, handler) {
    router.addRoute(pattern, handler);
    return api;
  }

  function resolve(path) {
    return router.resolve(path);
  }

  function navigate(path) {
    return router.navigate(path);
  }

  // Queue a path without navigating yet
  function queue(path, options = {}) {
    batch.add(path, options);
    return api;
  }

  // Flush queued paths; optionally navigate to the last successful one
  async function flushBatch(options = {}) {
    const results = await batch.flush();
    if (options.navigateToLast && router.navigate) {
      const last = [...results].reverse().find((r) => !r.error);
      if (last) router.navigate(last.path);
    }
    return results;
  }

  function batchSize() {
    return batch.size();
  }

  function clearBatch() {
    batch.clear();
    return api;
  }

  const api = { addRoute, resolve, navigate, queue, flushBatch, batchSize, clearBatch };
  return api;
}
