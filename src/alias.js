/**
 * createAliasManager — map route aliases to canonical paths
 */
export function createAliasManager() {
  const aliases = new Map();

  function add(alias, canonical) {
    if (typeof alias !== 'string' || typeof canonical !== 'string') {
      throw new Error('alias and canonical must be strings');
    }
    aliases.set(alias, canonical);
    return api;
  }

  function remove(alias) {
    aliases.delete(alias);
    return api;
  }

  function resolve(path) {
    if (aliases.has(path)) {
      return aliases.get(path);
    }
    // support prefix aliases like /old/* -> /new/*
    for (const [alias, canonical] of aliases) {
      if (alias.endsWith('*') && path.startsWith(alias.slice(0, -1))) {
        const rest = path.slice(alias.length - 1);
        return canonical.endsWith('*')
          ? canonical.slice(0, -1) + rest
          : canonical;
      }
    }
    return path;
  }

  function has(alias) {
    return aliases.has(alias);
  }

  function clear() {
    aliases.clear();
    return api;
  }

  function getAll() {
    return Object.fromEntries(aliases);
  }

  function size() {
    return aliases.size;
  }

  const api = { add, remove, resolve, has, clear, getAll, size };
  return api;
}
