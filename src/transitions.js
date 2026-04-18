/**
 * createTransitions - manage enter/leave transition hooks for route changes
 */
export function createTransitions() {
  const transitions = new Map();

  function define(name, { enter, leave } = {}) {
    if (typeof name !== 'string' || !name) throw new Error('Transition name must be a non-empty string');
    transitions.set(name, {
      enter: typeof enter === 'function' ? enter : null,
      leave: typeof leave === 'function' ? leave : null,
    });
  }

  function get(name) {
    return transitions.get(name) || null;
  }

  async function run(name, phase, context) {
    const transition = transitions.get(name);
    if (!transition) return;
    const fn = phase === 'enter' ? transition.enter : transition.leave;
    if (fn) await fn(context);
  }

  async function between(fromName, toName, context) {
    if (fromName) await run(fromName, 'leave', context);
    if (toName) await run(toName, 'enter', context);
  }

  function remove(name) {
    transitions.delete(name);
  }

  function clear() {
    transitions.clear();
  }

  function list() {
    return Array.from(transitions.keys());
  }

  return { define, get, run, between, remove, clear, list };
}
