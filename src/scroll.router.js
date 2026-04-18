/**
 * Convenience integration: attach scroll restoration to a snaproute router instance
 * Usage: withScrollRestoration(router, scrollOptions)
 */
import { createScrollManager } from './scroll.js';

export function withScrollRestoration(router, options = {}) {
  const scroll = createScrollManager(options);
  let currentPath = null;

  router.hooks.beforeEach((path) => {
    if (currentPath !== null) {
      scroll.save(currentPath);
    }
  });

  router.hooks.afterEach((path) => {
    currentPath = path;
    scroll.restore(path);
  });

  router.hooks.onError(() => {
    scroll.scrollToTop();
  });

  return scroll;
}
