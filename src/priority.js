/**
 * createPriorityManager — assign and sort routes by priority
 */
export function createPriorityManager() {
  const priorities = new Map();
  const DEFAULT_PRIORITY = 0;

  function set(pattern, priority) {
    if (typeof priority !== 'number') throw new TypeError('Priority must be a number');
    priorities.set(pattern, priority);
  }

  function get(pattern) {
    return priorities.has(pattern) ? priorities.get(pattern) : DEFAULT_PRIORITY;
  }

  function remove(pattern) {
    return priorities.delete(pattern);
  }

  function clear() {
    priorities.clear();
  }

  function sort(patterns) {
    return [...patterns].sort((a, b) => get(b) - get(a));
  }

  function sortRoutes(routes) {
    return [...routes].sort((a, b) => {
      const pa = get(a.pattern ?? a.path ?? a);
      const pb = get(b.pattern ?? b.path ?? b);
      return pb - pa;
    });
  }

  function size() {
    return priorities.size;
  }

  function entries() {
    return Array.from(priorities.entries()).map(([pattern, priority]) => ({ pattern, priority }));
  }

  return { set, get, remove, clear, sort, sortRoutes, size, entries };
}
