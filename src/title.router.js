// withTitle — integrate createTitleManager with a snaproute router

import { createTitleManager } from './title.js';

export function withTitle(router, options = {}) {
  const tm = createTitleManager(options);
  const _routes = new Map();

  function addRoute(pattern, handler, meta = {}) {
    if (meta.title) {
      tm.register(pattern, meta.title);
    }
    _routes.set(pattern, { handler, meta });
    return router.addRoute(pattern, handler);
  }

  function resolve(path) {
    const result = router.resolve(path);
    if (result) {
      tm.apply(result.pattern, result.params || {});
    }
    return result;
  }

  function setDefault(title) {
    tm.setDefault(title);
  }

  function setTemplate(template) {
    tm.setTemplate(template);
  }

  function currentTitle() {
    return tm.current();
  }

  return {
    ...router,
    addRoute,
    resolve,
    setDefault,
    setTemplate,
    currentTitle,
    _titleManager: tm,
  };
}
