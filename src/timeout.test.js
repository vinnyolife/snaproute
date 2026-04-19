import { createTimeoutManager } from './timeout.js';

describe('createTimeoutManager', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  test('returns default timeout for unregistered pattern', () => {
    const tm = createTimeoutManager(3000);
    expect(tm.getTimeout('/foo')).toBe(3000);
  });

  test('register and retrieve per-route timeout', () => {
    const tm = createTimeoutManager(3000);
    tm.register('/slow', 10000);
    expect(tm.getTimeout('/slow')).toBe(10000);
    expect(tm.size()).toBe(1);
  });

  test('unregister falls back to default', () => {
    const tm = createTimeoutManager(3000);
    tm.register('/slow', 10000);
    tm.unregister('/slow');
    expect(tm.getTimeout('/slow')).toBe(3000);
  });

  test('setDefault changes default', () => {
    const tm = createTimeoutManager(3000);
    tm.setDefault(1000);
    expect(tm.getTimeout('/any')).toBe(1000);
  });

  test('start triggers onTimeout after delay', () => {
    const tm = createTimeoutManager(500);
    const cb = jest.fn();
    tm.start('/page', cb);
    expect(tm.isActive()).toBe(true);
    jest.advanceTimersByTime(499);
    expect(cb).not.toHaveBeenCalled();
    jest.advanceTimersByTime(1);
    expect(cb).toHaveBeenCalledWith({ pattern: '/page', ms: 500 });
    expect(tm.isActive()).toBe(false);
  });

  test('cancel prevents onTimeout', () => {
    const tm = createTimeoutManager(500);
    const cb = jest.fn();
    tm.start('/page', cb);
    tm.cancel();
    jest.advanceTimersByTime(1000);
    expect(cb).not.toHaveBeenCalled();
    expect(tm.isActive()).toBe(false);
  });

  test('start cancels previous timer', () => {
    const tm = createTimeoutManager(500);
    const cb1 = jest.fn();
    const cb2 = jest.fn();
    tm.start('/a', cb1);
    tm.start('/b', cb2);
    jest.advanceTimersByTime(600);
    expect(cb1).not.toHaveBeenCalled();
    expect(cb2).toHaveBeenCalledTimes(1);
  });

  test('clear resets everything', () => {
    const tm = createTimeoutManager(500);
    tm.register('/x', 9000);
    tm.start('/x', jest.fn());
    tm.clear();
    expect(tm.size()).toBe(0);
    expect(tm.isActive()).toBe(false);
    expect(tm.getTimeout('/x')).toBe(500);
  });

  test('Infinity skips timer', () => {
    const tm = createTimeoutManager(Infinity);
    const cb = jest.fn();
    tm.start('/page', cb);
    expect(tm.isActive()).toBe(false);
    jest.advanceTimersByTime(99999);
    expect(cb).not.toHaveBeenCalled();
  });
});
