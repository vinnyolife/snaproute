// version manager — tracks route history versions and supports snapshotting

export function createVersionManager() {
  const snapshots = new Map();
  let history = [];
  let currentIndex = -1;

  function record(path) {
    // Truncate forward history on new navigation
    history = history.slice(0, currentIndex + 1);
    history.push(path);
    currentIndex = history.length - 1;
  }

  function snapshot(label) {
    if (!label || typeof label !== 'string') throw new Error('snapshot label required');
    snapshots.set(label, { history: [...history], index: currentIndex });
    return label;
  }

  function restore(label) {
    if (!snapshots.has(label)) return false;
    const snap = snapshots.get(label);
    history = [...snap.history];
    currentIndex = snap.index;
    return true;
  }

  function canUndo() {
    return currentIndex > 0;
  }

  function canRedo() {
    return currentIndex < history.length - 1;
  }

  function undo() {
    if (!canUndo()) return null;
    currentIndex -= 1;
    return history[currentIndex];
  }

  function redo() {
    if (!canRedo()) return null;
    currentIndex += 1;
    return history[currentIndex];
  }

  function current() {
    return history[currentIndex] ?? null;
  }

  function getHistory() {
    return [...history];
  }

  function clear() {
    history = [];
    currentIndex = -1;
    snapshots.clear();
  }

  function snapshotCount() {
    return snapshots.size;
  }

  return { record, snapshot, restore, canUndo, canRedo, undo, redo, current, getHistory, clear, snapshotCount };
}
