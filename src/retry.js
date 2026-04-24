/**
 * createRetryManager — retry failed route resolutions with backoff
 */
export function createRetryManager() {
  const configs = new Map();
  let defaultMax = 3;
  let defaultDelay = 100;

  function setDefault({ max, delay } = {}) {
    if (max !== undefined) defaultMax = max;
    if (delay !== undefined) defaultDelay = delay;
  }

  function register(pattern, { max, delay } = {}) {
    configs.set(pattern, {
      max: max !== undefined ? max : defaultMax,
      delay: delay !== undefined ? delay : defaultDelay,
    });
  }

  function unregister(pattern) {
    configs.delete(pattern);
  }

  function getConfig(pattern) {
    if (configs.has(pattern)) return configs.get(pattern);
    return { max: defaultMax, delay: defaultDelay };
  }

  function _wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function attempt(pattern, fn) {
    const { max, delay } = getConfig(pattern);
    let lastError;
    for (let i = 0; i <= max; i++) {
      try {
        return await fn();
      } catch (err) {
        lastError = err;
        if (i < max) await _wait(delay * Math.pow(2, i));
      }
    }
    throw lastError;
  }

  function clear() {
    configs.clear();
  }

  function size() {
    return configs.size;
  }

  return { setDefault, register, unregister, getConfig, attempt, clear, size };
}
