/**
 * createSignalManager — abort/cancel in-flight navigations via AbortSignal
 */
export function createSignalManager() {
  const controllers = new Map();

  function create(key) {
    if (controllers.has(key)) {
      controllers.get(key).abort();
    }
    const controller = new AbortController();
    controllers.set(key, controller);
    return controller.signal;
  }

  function abort(key) {
    if (controllers.has(key)) {
      controllers.get(key).abort();
      controllers.delete(key);
      return true;
    }
    return false;
  }

  function abortAll() {
    for (const controller of controllers.values()) {
      controller.abort();
    }
    controllers.clear();
  }

  function isAborted(key) {
    const ctrl = controllers.get(key);
    return ctrl ? ctrl.signal.aborted : false;
  }

  function has(key) {
    return controllers.has(key);
  }

  function remove(key) {
    controllers.delete(key);
  }

  function size() {
    return controllers.size;
  }

  return { create, abort, abortAll, isAborted, has, remove, size };
}
