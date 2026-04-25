import { createTagManager } from './tags.js';

/**
 * withTags — extends a router with tag-based route filtering
 */
export function withTags(router) {
  const manager = createTagManager();

  function addRoute(path, handler, ...routeTags) {
    router.addRoute(path, handler);
    if (routeTags.length) manager.add(path, ...routeTags);
  }

  function tag(path, ...routeTags) {
    manager.add(path, ...routeTags);
  }

  function untag(path, ...routeTags) {
    manager.remove(path, ...routeTags);
  }

  function getRoutesByTag(tagName) {
    return manager.getRoutes(tagName);
  }

  function getTagsForRoute(path) {
    return manager.getTags(path);
  }

  function resolveTagged(path) {
    const result = router.resolve(path);
    if (!result) return null;
    return { ...result, tags: manager.getTags(path) };
  }

  function filterByTag(paths, tagName) {
    return paths.filter(p => manager.hasTag(p, tagName));
  }

  return {
    ...router,
    addRoute,
    tag,
    untag,
    getRoutesByTag,
    getTagsForRoute,
    resolveTagged,
    filterByTag,
  };
}
