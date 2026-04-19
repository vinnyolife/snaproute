/**
 * createRedirectManager — manage named redirects and redirect rules
 */
export function createRedirectManager() {
  const redirects = new Map();

  function add(from, to, { permanent = false } = {}) {
    redirects.set(from, { to, permanent });
  }

  function remove(from) {
    redirects.delete(from);
  }

  function resolve(path) {
    if (!redirects.has(path)) return null;
    const { to, permanent } = redirects.get(path);
    const resolved = typeof to === 'function' ? to(path) : to;
    return { to: resolved, permanent };
  }

  function has(path) {
    return redirects.has(path);
  }

  function clear() {
    redirects.clear();
  }

  function size() {
    return redirects.size;
  }

  return { add, remove, resolve, has, clear, size };
}

/**
 * withRedirects — wraps a router to intercept navigation and apply redirects
 */
export function withRedirects(router, redirectManager) {
  const originalNavigate = router.navigate.bind(router);

  function navigate(path, options = {}) {
    const match = redirectManager.resolve(path);
    if (match) {
      return originalNavigate(match.to, { ...options, replaced: match.permanent });
    }
    return originalNavigate(path, options);
  }

  return { ...router, navigate };
}
