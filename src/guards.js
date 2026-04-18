/**
 * Route guards — allow/deny navigation based on async or sync checks
 */
export function createGuards() {
  const guards = [];

  function add(fn) {
    if (typeof fn !== 'function') throw new Error('Guard must be a function');
    guards.push(fn);
    return () => remove(fn);
  }

  function remove(fn) {
    const i = guards.indexOf(fn);
    if (i !== -1) guards.splice(i, 1);
  }

  function clear() {
    guards.length = 0;
  }

  async function run(from, to) {
    for (const guard of guards) {
      let result;
      try {
        result = await guard(from, to);
      } catch (err) {
        return { allowed: false, reason: err };
      }
      if (result === false) {
        return { allowed: false, reason: null };
      }
      if (typeof result === 'string') {
        return { allowed: false, redirect: result };
      }
    }
    return { allowed: true };
  }

  function size() {
    return guards.length;
  }

  return { add, remove, run, clear, size };
}
