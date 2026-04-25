// withVersion — wraps a router with navigation versioning (undo/redo + snapshots)

import { createVersionManager } from './version.js';

export function withVersion(router) {
  const vm = createVersionManager();

  function addRoute(pattern, handler) {
    return router.addRoute(pattern, handler);
  }

  function resolve(path) {
    const result = router.resolve(path);
    if (result) vm.record(path);
    return result;
  }

  function navigate(path) {
    const result = router.navigate ? router.navigate(path) : router.resolve(path);
    if (result) vm.record(path);
    return result;
  }

  function undo() {
    const path = vm.undo();
    if (path === null) return null;
    return { path, result: router.resolve(path) };
  }

  function redo() {
    const path = vm.redo();
    if (path === null) return null;
    return { path, result: router.resolve(path) };
  }

  function snapshot(label) {
    return vm.snapshot(label);
  }

  function restore(label) {
    return vm.restore(label);
  }

  function canUndo() { return vm.canUndo(); }
  function canRedo() { return vm.canRedo(); }
  function getHistory() { return vm.getHistory(); }
  function current() { return vm.current(); }
  function clear() { return vm.clear(); }

  return { addRoute, resolve, navigate, undo, redo, snapshot, restore, canUndo, canRedo, getHistory, current, clear };
}
