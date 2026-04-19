/**
 * createTimeoutManager — per-route navigation timeout support
 */
export function createTimeoutManager(defaultMs = 5000) {
  const timeouts = new Map();
  let _default = defaultMs;
  let _activeTimer = null;

  function setDefault(ms) {
    _default = ms;
  }

  function register(pattern, ms) {
    timeouts.set(pattern, ms);
  }

  function unregister(pattern) {
    timeouts.delete(pattern);
  }

  function getTimeout(pattern) {
    return timeouts.has(pattern) ? timeouts.get(pattern) : _default;
  }

  function start(pattern, onTimeout) {
    cancel();
    const ms = getTimeout(pattern);
    if (ms == null || ms === Infinity) return;
    _activeTimer = setTimeout(() => {
      _activeTimer = null;
      onTimeout({ pattern, ms });
    }, ms);
  }

  function cancel() {
    if (_activeTimer !== null) {
      clearTimeout(_activeTimer);
      _activeTimer = null;
    }
  }

  function isActive() {
    return _activeTimer !== null;
  }

  function clear() {
    cancel();
    timeouts.clear();
    _default = defaultMs;
  }

  function size() {
    return timeouts.size;
  }

  return { setDefault, register, unregister, getTimeout, start, cancel, isActive, clear, size };
}
