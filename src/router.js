import { createMiddlewarePipeline } from './middleware.js';

export function createRouter(options = {}) {
  const routes = [];
  const pipeline = createMiddlewarePipeline();
  const { base = '' } = options;

  function addRoute(path, handler) {
    const paramNames = [];
    const pattern = path
      .replace(/:([a-zA-Z]+)/g, (_, name) => {
        paramNames.push(name);
        return '([^/]+)';
      })
      .replace(/\*/g, '.*');

    routes.push({
      path,
      pattern: new RegExp(`^${base}${pattern}$`),
      paramNames,
      handler,
    });
  }

  function resolve(url) {
    const [path, queryString] = url.split('?');
    const query = {};
    if (queryString) {
      queryString.split('&').forEach((pair) => {
        const [k, v] = pair.split('=');
        if (k) query[decodeURIComponent(k)] = decodeURIComponent(v || '');
      });
    }

    for (const route of routes) {
      const match = path.match(route.pattern);
      if (match) {
        const params = {};
        route.paramNames.forEach((name, i) => {
          params[name] = match[i + 1];
        });
        return { route, params, query, path };
      }
    }
    return null;
  }

  function dispatch(url) {
    const match = resolve(url);
    if (!match) return;

    const context = { path: match.path, params: match.params, query: match.query };

    pipeline.run(context, (err) => {
      if (err) {
        if (context.redirect) navigate(context.redirect);
        return;
      }
      match.route.handler(context);
    });
  }

  function navigate(url) {
    history.pushState(null, '', url);
    dispatch(url);
  }

  function use(fn) {
    pipeline.use(fn);
    return router;
  }

  function listen() {
    window.addEventListener('popstate', () => dispatch(location.pathname + location.search));
    dispatch(location.pathname + location.search);
  }

  const router = { addRoute, resolve, navigate, dispatch, use, listen };
  return router;
}
