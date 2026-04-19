// createEventBus — simple pub/sub event emitter for router lifecycle events

export function createEventBus() {
  const listeners = new Map();

  function on(event, handler) {
    if (!listeners.has(event)) listeners.set(event, new Set());
    listeners.get(event).add(handler);
    return () => off(event, handler);
  }

  function off(event, handler) {
    if (!listeners.has(event)) return;
    listeners.get(event).delete(handler);
    if (listeners.get(event).size === 0) listeners.delete(event);
  }

  function once(event, handler) {
    const wrapped = (...args) => {
      handler(...args);
      off(event, wrapped);
    };
    return on(event, wrapped);
  }

  function emit(event, ...args) {
    if (!listeners.has(event)) return;
    for (const handler of listeners.get(event)) {
      try {
        handler(...args);
      } catch (err) {
        console.error(`[snaproute] event handler error on "${event}":`, err);
      }
    }
  }

  function clear(event) {
    if (event) {
      listeners.delete(event);
    } else {
      listeners.clear();
    }
  }

  function size(event) {
    if (event) return listeners.get(event)?.size ?? 0;
    let total = 0;
    for (const s of listeners.values()) total += s.size;
    return total;
  }

  return { on, off, once, emit, clear, size };
}
