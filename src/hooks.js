/**
 * Route lifecycle hooks for snaproute
 * beforeEach, afterEach, onError
 */

export function createHooks() {
  const hooks = {
    beforeEach: [],
    afterEach: [],
    onError: [],
  };

  function beforeEach(fn) {
    hooks.beforeEach.push(fn);
    return () => remove(hooks.beforeEach, fn);
  }

  function afterEach(fn) {
    hooks.afterEach.push(fn);
    return () => remove(hooks.afterEach, fn);
  }

  function onError(fn) {
    hooks.onError.push(fn);
    return () => remove(hooks.onError, fn);
  }

  function remove(list, fn) {
    const i = list.indexOf(fn);
    if (i !== -1) list.splice(i, 1);
  }

  async function runBeforeEach(to, from) {
    for (const fn of hooks.beforeEach) {
      const result = await fn(to, from);
      if (result === false) return false;
    }
    return true;
  }

  async function runAfterEach(to, from) {
    for (const fn of hooks.afterEach) {
      await fn(to, from);
    }
  }

  async function runOnError(err, to, from) {
    for (const fn of hooks.onError) {
      await fn(err, to, from);
    }
  }

  function clear() {
    hooks.beforeEach.length = 0;
    hooks.afterEach.length = 0;
    hooks.onError.length = 0;
  }

  return { beforeEach, afterEach, onError, runBeforeEach, runAfterEach, runOnError, clear };
}
