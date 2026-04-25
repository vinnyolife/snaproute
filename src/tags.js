/**
 * createTagManager — associate string tags with routes and filter/query by them
 */
export function createTagManager() {
  const routeTags = new Map(); // routeKey -> Set<string>
  const tagRoutes = new Map(); // tag -> Set<routeKey>

  function add(routeKey, ...tags) {
    if (!routeTags.has(routeKey)) routeTags.set(routeKey, new Set());
    for (const tag of tags) {
      routeTags.get(routeKey).add(tag);
      if (!tagRoutes.has(tag)) tagRoutes.set(tag, new Set());
      tagRoutes.get(tag).add(routeKey);
    }
  }

  function remove(routeKey, ...tags) {
    if (!routeTags.has(routeKey)) return;
    for (const tag of tags) {
      routeTags.get(routeKey).delete(tag);
      if (tagRoutes.has(tag)) tagRoutes.get(tag).delete(routeKey);
    }
  }

  function getTags(routeKey) {
    return routeTags.has(routeKey) ? [...routeTags.get(routeKey)] : [];
  }

  function getRoutes(tag) {
    return tagRoutes.has(tag) ? [...tagRoutes.get(tag)] : [];
  }

  function hasTag(routeKey, tag) {
    return routeTags.has(routeKey) && routeTags.get(routeKey).has(tag);
  }

  function matchAny(routeKey, tags) {
    return tags.some(t => hasTag(routeKey, t));
  }

  function matchAll(routeKey, tags) {
    return tags.every(t => hasTag(routeKey, t));
  }

  function clear(routeKey) {
    if (!routeTags.has(routeKey)) return;
    for (const tag of routeTags.get(routeKey)) {
      if (tagRoutes.has(tag)) tagRoutes.get(tag).delete(routeKey);
    }
    routeTags.delete(routeKey);
  }

  function clearAll() {
    routeTags.clear();
    tagRoutes.clear();
  }

  function size() {
    return routeTags.size;
  }

  return { add, remove, getTags, getRoutes, hasTag, matchAny, matchAll, clear, clearAll, size };
}
