/**
 * createAnalytics — track route visits and timing
 */
export function createAnalytics() {
  const entries = [];
  let adapter = null;
  let started = null;

  function setAdapter(fn) {
    adapter = fn;
  }

  function trackStart(path) {
    started = { path, time: Date.now() };
  }

  function trackEnd(path, params = {}) {
    const duration = started && started.path === path
      ? Date.now() - started.time
      : null;
    started = null;

    const entry = {
      path,
      params,
      duration,
      timestamp: Date.now(),
    };

    entries.push(entry);

    if (typeof adapter === 'function') {
      try {
        adapter(entry);
      } catch (e) {
        // never let analytics break routing
      }
    }

    return entry;
  }

  function getEntries() {
    return [...entries];
  }

  function getLast() {
    return entries[entries.length - 1] ?? null;
  }

  function clear() {
    entries.length = 0;
    started = null;
  }

  function size() {
    return entries.length;
  }

  return { setAdapter, trackStart, trackEnd, getEntries, getLast, clear, size };
}
