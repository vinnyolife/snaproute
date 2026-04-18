/**
 * history.js - HTML5 History API wrapper for snaproute
 */

export function createHistory() {
  const listeners = [];

  function getCurrentPath() {
    return window.location.pathname + window.location.search + window.location.hash;
  }

  function push(path, state = {}) {
    window.history.pushState(state, '', path);
    notify(path, state);
  }

  function replace(path, state = {}) {
    window.history.replaceState(state, '', path);
    notify(path, state);
  }

  function back() {
    window.history.back();
  }

  function forward() {
    window.history.forward();
  }

  function notify(path, state) {
    listeners.forEach(fn => fn({ path, state }));
  }

  function listen(fn) {
    listeners.push(fn);
    const onPop = (event) => fn({ path: getCurrentPath(), state: event.state || {} });
    window.addEventListener('popstate', onPop);
    return function unlisten() {
      const idx = listeners.indexOf(fn);
      if (idx !== -1) listeners.splice(idx, 1);
      window.removeEventListener('popstate', onPop);
    };
  }

  function destroy() {
    listeners.length = 0;
  }

  return {
    getCurrentPath,
    push,
    replace,
    back,
    forward,
    listen,
    destroy
  };
}
