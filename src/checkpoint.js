/**
 * createCheckpointManager
 * Save and restore named navigation checkpoints (snapshots of a path + state).
 */
export function createCheckpointManager() {
  const checkpoints = new Map();

  function save(name, path, state = {}) {
    if (!name || typeof name !== 'string') throw new Error('Checkpoint name must be a non-empty string');
    if (!path || typeof path !== 'string') throw new Error('Checkpoint path must be a non-empty string');
    checkpoints.set(name, { name, path, state, savedAt: Date.now() });
    return checkpoints.get(name);
  }

  function restore(name) {
    if (!checkpoints.has(name)) return null;
    return checkpoints.get(name);
  }

  function has(name) {
    return checkpoints.has(name);
  }

  function remove(name) {
    return checkpoints.delete(name);
  }

  function clear() {
    checkpoints.clear();
  }

  function list() {
    return Array.from(checkpoints.values());
  }

  function size() {
    return checkpoints.size;
  }

  function rename(oldName, newName) {
    if (!checkpoints.has(oldName)) return false;
    if (!newName || typeof newName !== 'string') throw new Error('New name must be a non-empty string');
    const entry = checkpoints.get(oldName);
    checkpoints.delete(oldName);
    checkpoints.set(newName, { ...entry, name: newName });
    return true;
  }

  return { save, restore, has, remove, clear, list, size, rename };
}
