/**
 * createFreezeManager — prevent navigation during critical operations
 */
export function createFreezeManager() {
  const reasons = new Set();

  function freeze(reason = 'default') {
    reasons.add(reason);
  }

  function unfreeze(reason = 'default') {
    reasons.delete(reason);
  }

  function isFrozen() {
    return reasons.size > 0;
  }

  function getReasons() {
    return Array.from(reasons);
  }

  function clear() {
    reasons.clear();
  }

  function ifFrozen(callback) {
    if (isFrozen()) {
      callback(getReasons());
      return true;
    }
    return false;
  }

  function withFreeze(reason, fn) {
    freeze(reason);
    let result;
    try {
      result = fn();
    } finally {
      if (result && typeof result.then === 'function') {
        return result.finally(() => unfreeze(reason));
      }
      unfreeze(reason);
    }
    return result;
  }

  function size() {
    return reasons.size;
  }

  return {
    freeze,
    unfreeze,
    isFrozen,
    getReasons,
    clear,
    ifFrozen,
    withFreeze,
    size,
  };
}
