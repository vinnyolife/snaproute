/**
 * Scroll restoration for snaproute
 * Saves and restores scroll positions per route path
 */
export function createScrollManager(options = {}) {
  const { behavior = 'auto', restoreOnBack = true } = options;
  const positions = new Map();

  function save(path) {
    if (typeof path !== 'string' || !path) return;
    positions.set(path, {
      x: window.scrollX,
      y: window.scrollY,
    });
  }

  function restore(path) {
    if (!restoreOnBack) return scrollToTop();
    const pos = positions.get(path);
    if (pos) {
      window.scrollTo({ left: pos.x, top: pos.y, behavior });
    } else {
      scrollToTop();
    }
  }

  function scrollToTop() {
    window.scrollTo({ left: 0, top: 0, behavior });
  }

  function clear(path) {
    if (path) {
      positions.delete(path);
    } else {
      positions.clear();
    }
  }

  function has(path) {
    return positions.has(path);
  }

  function size() {
    return positions.size;
  }

  /** Returns a copy of the saved position for the given path, or null if not found */
  function get(path) {
    const pos = positions.get(path);
    return pos ? { ...pos } : null;
  }

  return { save, restore, scrollToTop, clear, has, size, get };
}
