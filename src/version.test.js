import { createVersionManager } from './version.js';

let vm;
beforeEach(() => { vm = createVersionManager(); });

test('record and retrieve current path', () => {
  vm.record('/home');
  expect(vm.current()).toBe('/home');
});

test('getHistory returns all recorded paths', () => {
  vm.record('/a');
  vm.record('/b');
  vm.record('/c');
  expect(vm.getHistory()).toEqual(['/a', '/b', '/c']);
});

test('canUndo and undo move back in history', () => {
  vm.record('/a');
  vm.record('/b');
  expect(vm.canUndo()).toBe(true);
  expect(vm.undo()).toBe('/a');
  expect(vm.current()).toBe('/a');
});

test('canRedo and redo move forward in history', () => {
  vm.record('/a');
  vm.record('/b');
  vm.undo();
  expect(vm.canRedo()).toBe(true);
  expect(vm.redo()).toBe('/b');
});

test('undo returns null when at beginning', () => {
  vm.record('/only');
  expect(vm.canUndo()).toBe(false);
  expect(vm.undo()).toBeNull();
});

test('redo returns null when at end', () => {
  vm.record('/only');
  expect(vm.canRedo()).toBe(false);
  expect(vm.redo()).toBeNull();
});

test('new record after undo truncates forward history', () => {
  vm.record('/a');
  vm.record('/b');
  vm.record('/c');
  vm.undo();
  vm.record('/d');
  expect(vm.getHistory()).toEqual(['/a', '/b', '/d']);
  expect(vm.canRedo()).toBe(false);
});

test('snapshot and restore', () => {
  vm.record('/a');
  vm.record('/b');
  vm.snapshot('before-nav');
  vm.record('/c');
  expect(vm.current()).toBe('/c');
  vm.restore('before-nav');
  expect(vm.current()).toBe('/b');
  expect(vm.getHistory()).toEqual(['/a', '/b']);
});

test('restore returns false for unknown label', () => {
  expect(vm.restore('nope')).toBe(false);
});

test('snapshot throws without label', () => {
  expect(() => vm.snapshot()).toThrow();
});

test('clear resets everything', () => {
  vm.record('/a');
  vm.snapshot('s1');
  vm.clear();
  expect(vm.current()).toBeNull();
  expect(vm.getHistory()).toEqual([]);
  expect(vm.snapshotCount()).toBe(0);
});
