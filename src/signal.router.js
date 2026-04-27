import { createSignalManager } from './signal.js';

/**
 * withSignal — wraps a router to attach AbortSignals to navigations,
 * automatically aborting the previous in-flight navigation on new navigate calls.
 */
export function withSignal(router) {
  const sm = createSignalManager();
  const NAV_KEY = '__navigation__';

  function navigate(path, options = {}) {
    const signal = sm.create(NAV_KEY);
    return router.navigate(path, { ...options, signal });
  }

  function resolve(path) {
    const signal = sm.create(NAV_KEY);
    return router.resolve(path, { signal });
  }

  function abortNavigation() {
    return sm.abort(NAV_KEY);
  }

  function isNavigating() {
    return sm.has(NAV_KEY) && !sm.isAborted(NAV_KEY);
  }

  function getSignal() {
    return sm.has(NAV_KEY) ? sm.create(NAV_KEY) : null;
  }

  function addRoute(...args) {
    return router.addRoute(...args);
  }

  return {
    ...router,
    navigate,
    resolve,
    abortNavigation,
    isNavigating,
    getSignal,
    addRoute,
    _signals: sm,
  };
}
