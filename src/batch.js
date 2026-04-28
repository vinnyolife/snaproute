// createBatchManager — queue and flush multiple navigations as a single operation
export function createBatchManager(router) {
  let queue = [];
  let flushing = false;

  function add(path, options = {}) {
    queue.push({ path, options });
    return api;
  }

  function size() {
    return queue.length;
  }

  function clear() {
    queue = [];
    return api;
  }

  async function flush() {
    if (flushing || queue.length === 0) return [];
    flushing = true;
    const batch = queue.slice();
    queue = [];
    const results = [];
    for (const { path, options } of batch) {
      try {
        const result = await router.resolve(path);
        results.push({ path, result, error: null });
        if (options.navigate && router.navigate) {
          router.navigate(path);
        }
      } catch (error) {
        results.push({ path, result: null, error });
        if (options.stopOnError) {
          flushing = false;
          return results;
        }
      }
    }
    flushing = false;
    return results;
  }

  function isFlushing() {
    return flushing;
  }

  function peek() {
    return queue.slice();
  }

  const api = { add, flush, clear, size, isFlushing, peek };
  return api;
}
