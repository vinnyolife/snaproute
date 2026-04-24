/**
 * createRateLimitManager
 * Limits how frequently a route or action can be triggered within a time window.
 */
export function createRateLimitManager() {
  const limits = new Map();
  const hits = new Map();

  function setLimit(key, maxHits, windowMs) {
    if (typeof maxHits !== 'number' || maxHits < 1) throw new Error('maxHits must be a positive number');
    if (typeof windowMs !== 'number' || windowMs < 1) throw new Error('windowMs must be a positive number');
    limits.set(key, { maxHits, windowMs });
  }

  function remove(key) {
    limits.delete(key);
    hits.delete(key);
  }

  function clear() {
    limits.clear();
    hits.clear();
  }

  function _getWindow(key) {
    if (!hits.has(key)) hits.set(key, []);
    return hits.get(key);
  }

  function check(key) {
    if (!limits.has(key)) return { allowed: true, remaining: Infinity, resetIn: 0 };
    const { maxHits, windowMs } = limits.get(key);
    const now = Date.now();
    const window = _getWindow(key).filter(ts => now - ts < windowMs);
    hits.set(key, window);
    const remaining = maxHits - window.length;
    const resetIn = window.length > 0 ? windowMs - (now - window[0]) : 0;
    return {
      allowed: remaining > 0,
      remaining: Math.max(0, remaining),
      resetIn: remaining > 0 ? 0 : Math.ceil(resetIn),
    };
  }

  function consume(key) {
    const result = check(key);
    if (!result.allowed) return result;
    _getWindow(key).push(Date.now());
    const { maxHits } = limits.get(key) || {};
    return {
      allowed: true,
      remaining: result.remaining - 1,
      resetIn: 0,
    };
  }

  function size() {
    return limits.size;
  }

  return { setLimit, remove, clear, check, consume, size };
}
