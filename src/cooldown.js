/**
 * createCooldownManager
 * Prevents a route from being navigated to more than once within a cooldown window.
 */
export function createCooldownManager() {
  const cooldowns = new Map();
  const timestamps = new Map();

  function setDefault(ms) {
    cooldowns.set('__default__', ms);
  }

  function register(route, ms) {
    if (typeof route !== 'string' || route.trim() === '') throw new Error('route must be a non-empty string');
    if (typeof ms !== 'number' || ms < 0) throw new Error('ms must be a non-negative number');
    cooldowns.set(route, ms);
  }

  function unregister(route) {
    cooldowns.delete(route);
    timestamps.delete(route);
  }

  function getCooldown(route) {
    return cooldowns.has(route) ? cooldowns.get(route) : (cooldowns.get('__default__') ?? null);
  }

  function isOnCooldown(route) {
    const ms = getCooldown(route);
    if (ms === null) return false;
    const last = timestamps.get(route);
    if (last === undefined) return false;
    return Date.now() - last < ms;
  }

  function remainingTime(route) {
    const ms = getCooldown(route);
    if (ms === null) return 0;
    const last = timestamps.get(route);
    if (last === undefined) return 0;
    const remaining = ms - (Date.now() - last);
    return remaining > 0 ? remaining : 0;
  }

  function record(route) {
    timestamps.set(route, Date.now());
  }

  function reset(route) {
    timestamps.delete(route);
  }

  function clear() {
    cooldowns.clear();
    timestamps.clear();
  }

  function size() {
    return cooldowns.size;
  }

  return { setDefault, register, unregister, getCooldown, isOnCooldown, remainingTime, record, reset, clear, size };
}
