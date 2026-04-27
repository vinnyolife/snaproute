// createThrottleManager — limits how frequently a route can be navigated to
export function createThrottleManager() {
  const limits = new Map();   // route -> ms
  const lastCall = new Map(); // route -> timestamp

  function setLimit(route, ms) {
    if (typeof ms !== 'number' || ms < 0) throw new Error('Throttle limit must be a non-negative number');
    limits.set(route, ms);
  }

  function remove(route) {
    limits.delete(route);
    lastCall.delete(route);
  }

  function clear() {
    limits.clear();
    lastCall.clear();
  }

  function isThrottled(route) {
    if (!limits.has(route)) return false;
    const last = lastCall.get(route);
    if (last === undefined) return false;
    return Date.now() - last < limits.get(route);
  }

  function remainingTime(route) {
    if (!limits.has(route)) return 0;
    const last = lastCall.get(route);
    if (last === undefined) return 0;
    const diff = limits.get(route) - (Date.now() - last);
    return diff > 0 ? diff : 0;
  }

  function record(route) {
    lastCall.set(route, Date.now());
  }

  // Returns true if navigation was allowed, false if throttled
  function attempt(route) {
    if (isThrottled(route)) return false;
    record(route);
    return true;
  }

  function size() {
    return limits.size;
  }

  return { setLimit, remove, clear, isThrottled, remainingTime, record, attempt, size };
}
