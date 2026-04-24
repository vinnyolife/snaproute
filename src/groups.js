/**
 * createGroupManager — group routes under a shared prefix and shared options
 */
export function createGroupManager() {
  const groups = new Map();

  function add(name, { prefix = '', meta = {}, guards = [] } = {}) {
    if (groups.has(name)) throw new Error(`Group "${name}" already exists`);
    groups.set(name, { prefix: normalizePrefix(prefix), meta, guards });
    return api;
  }

  function remove(name) {
    return groups.delete(name);
  }

  function get(name) {
    return groups.has(name) ? { ...groups.get(name) } : null;
  }

  function has(name) {
    return groups.has(name);
  }

  function applyGroup(name, path) {
    const group = groups.get(name);
    if (!group) throw new Error(`Group "${name}" not found`);
    const joined = group.prefix + (path.startsWith('/') ? path : '/' + path);
    return joined.replace(/\/+/g, '/');
  }

  function getMeta(name) {
    const group = groups.get(name);
    return group ? { ...group.meta } : {};
  }

  function getGuards(name) {
    const group = groups.get(name);
    return group ? [...group.guards] : [];
  }

  function clear() {
    groups.clear();
    return api;
  }

  function size() {
    return groups.size;
  }

  function normalizePrefix(prefix) {
    if (!prefix) return '';
    const p = prefix.startsWith('/') ? prefix : '/' + prefix;
    return p.endsWith('/') ? p.slice(0, -1) : p;
  }

  const api = { add, remove, get, has, applyGroup, getMeta, getGuards, clear, size };
  return api;
}
