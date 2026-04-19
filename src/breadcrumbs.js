/**
 * createBreadcrumbs — tracks navigation history as a breadcrumb trail
 */
export function createBreadcrumbs({ max = 10 } = {}) {
  let trail = [];

  function push(entry) {
    if (!entry || !entry.path) throw new Error('Breadcrumb entry must have a path');
    const crumb = { path: entry.path, label: entry.label || entry.path, meta: entry.meta || {} };
    trail.push(crumb);
    if (trail.length > max) trail.shift();
  }

  function pop() {
    return trail.pop();
  }

  function get() {
    return [...trail];
  }

  function current() {
    return trail[trail.length - 1] || null;
  }

  function clear() {
    trail = [];
  }

  function size() {
    return trail.length;
  }

  return { push, pop, get, current, clear, size };
}
