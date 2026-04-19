// createPipeline: composable route handler pipeline
// Runs an ordered list of handlers, stopping if one returns false

export function createPipeline() {
  const stages = [];

  function add(name, fn) {
    if (typeof fn !== 'function') throw new Error('Pipeline stage must be a function');
    stages.push({ name, fn });
    return api;
  }

  function remove(name) {
    const idx = stages.findIndex(s => s.name === name);
    if (idx !== -1) stages.splice(idx, 1);
    return api;
  }

  function has(name) {
    return stages.some(s => s.name === name);
  }

  async function run(context) {
    const results = [];
    for (const stage of stages) {
      let result;
      try {
        result = await stage.fn(context);
      } catch (err) {
        return { ok: false, stage: stage.name, error: err, results };
      }
      results.push({ stage: stage.name, result });
      if (result === false) {
        return { ok: false, stage: stage.name, aborted: true, results };
      }
      if (result && typeof result === 'object') {
        Object.assign(context, result);
      }
    }
    return { ok: true, results, context };
  }

  function clear() {
    stages.length = 0;
    return api;
  }

  function size() {
    return stages.length;
  }

  function list() {
    return stages.map(s => s.name);
  }

  const api = { add, remove, has, run, clear, size, list };
  return api;
}
