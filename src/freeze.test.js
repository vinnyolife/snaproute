import { createFreezeManager } from './freeze.js';

describe('createFreezeManager', () => {
  let mgr;

  beforeEach(() => {
    mgr = createFreezeManager();
  });

  test('starts unfrozen', () => {
    expect(mgr.isFrozen()).toBe(false);
    expect(mgr.size()).toBe(0);
  });

  test('freeze and unfreeze with default reason', () => {
    mgr.freeze();
    expect(mgr.isFrozen()).toBe(true);
    mgr.unfreeze();
    expect(mgr.isFrozen()).toBe(false);
  });

  test('supports multiple named reasons', () => {
    mgr.freeze('save');
    mgr.freeze('upload');
    expect(mgr.isFrozen()).toBe(true);
    expect(mgr.size()).toBe(2);
    mgr.unfreeze('save');
    expect(mgr.isFrozen()).toBe(true);
    mgr.unfreeze('upload');
    expect(mgr.isFrozen()).toBe(false);
  });

  test('getReasons returns active reasons', () => {
    mgr.freeze('a');
    mgr.freeze('b');
    const reasons = mgr.getReasons();
    expect(reasons).toContain('a');
    expect(reasons).toContain('b');
    expect(reasons.length).toBe(2);
  });

  test('clear removes all reasons', () => {
    mgr.freeze('x');
    mgr.freeze('y');
    mgr.clear();
    expect(mgr.isFrozen()).toBe(false);
    expect(mgr.size()).toBe(0);
  });

  test('ifFrozen calls callback when frozen and returns true', () => {
    mgr.freeze('nav');
    const cb = jest.fn();
    const result = mgr.ifFrozen(cb);
    expect(result).toBe(true);
    expect(cb).toHaveBeenCalledWith(['nav']);
  });

  test('ifFrozen returns false and skips callback when not frozen', () => {
    const cb = jest.fn();
    const result = mgr.ifFrozen(cb);
    expect(result).toBe(false);
    expect(cb).not.toHaveBeenCalled();
  });

  test('withFreeze freezes during sync fn and unfreezes after', () => {
    let frozenDuring = false;
    mgr.withFreeze('op', () => {
      frozenDuring = mgr.isFrozen();
    });
    expect(frozenDuring).toBe(true);
    expect(mgr.isFrozen()).toBe(false);
  });

  test('withFreeze unfreezes after async fn resolves', async () => {
    const promise = mgr.withFreeze('async-op', () => Promise.resolve('done'));
    expect(mgr.isFrozen()).toBe(true);
    await promise;
    expect(mgr.isFrozen()).toBe(false);
  });

  test('duplicate freeze reason does not increase size', () => {
    mgr.freeze('dup');
    mgr.freeze('dup');
    expect(mgr.size()).toBe(1);
  });
});
