/**
 * createDebounceManager
 * Debounces rapid navigation calls to prevent excessive route resolution.
 */
export function createDebounceManager() {
  const timers = new Map();
  let defaultDelay = 150;

  function setDefault(ms) {
    defaultDelay = ms;
  }

  function debounce(key, fn, delay) {
    const ms = delay !== undefined ? delay : defaultDelay;

    if (timers.has(key)) {
      clearTimeout(timers.get(key));
    }

    return new Promise((resolve) => {
      const id = setTimeout(() => {
        timers.delete(key);
        resolve(fn());
      }, ms);
      timers.set(key, id);
    });
  }

  function cancel(key) {
    if (timers.has(key)) {
      clearTimeout(timers.get(key));
      timers.delete(key);
      return true;
    }
    return false;
  }

  function cancelAll() {
    for (const id of timers.values()) {
      clearTimeout(id);
    }
    timers.clear();
  }

  function isPending(key) {
    return timers.has(key);
  }

  function size() {
    return timers.size;
  }

  return { setDefault, debounce, cancel, cancelAll, isPending, size };
}
