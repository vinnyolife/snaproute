/**
 * snaproute - Lightweight client-side router
 */

function createRouter() {
  const routes = [];
  let notFoundHandler = null;

  function addRoute(path, handler) {
    const keys = [];
    const pattern = path
      .replace(/:([a-zA-Z_][a-zA-Z0-9_]*)/g, (_, key) => {
        keys.push(key);
        return '([^\/]+)';
      })
      .replace(/\//g, '\\/');

    routes.push({
      path,
      pattern: new RegExp(`^${pattern}$`),
      keys,
      handler,
    });
  }

  function resolve(url) {
    const [pathname] = url.split('?');

    for (const route of routes) {
      const match = pathname.match(route.pattern);
      if (match) {
        const params = {};
        route.keys.forEach((key, i) => {
          params[key] = decodeURIComponent(match[i + 1]);
        });
        return { handler: route.handler, params };
      }
    }

    return notFoundHandler ? { handler: notFoundHandler, params: {} } : null;
  }

  function navigate(path) {
    window.history.pushState({}, '', path);
    dispatch(path);
  }

  function dispatch(path) {
    const result = resolve(path);
    if (result) {
      result.handler({ params: result.params, path });
    }
  }

  function listen() {
    window.addEventListener('popstate', () => {
      dispatch(window.location.pathname);
    });
    dispatch(window.location.pathname);
  }

  function onNotFound(handler) {
    notFoundHandler = handler;
  }

  return { addRoute, navigate, listen, onNotFound, resolve };
}

export { createRouter };
