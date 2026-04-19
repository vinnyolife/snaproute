import { createDebounceManager } from './debounce.js';

function wait(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

describe('createDebounceManager', () => {
  let dm;

  beforeEach(() => {
    dm = createDebounceManager();
  });

  afterEach(() => {
    dm.cancelAll();
  });

  test('calls fn after delay', async () => {
    const fn = jest.fn(() => 'result');
    const p = dm.debounce('nav', fn, 30);
    expect(fn).not.toHaveBeenCalled();
    await p;
    expect(fn).toHaveBeenCalledTimes(1);
  });

  test('debounces multiple calls with same key', async () => {
    const fn = jest.fn(() => 'ok');
    dm.debounce('nav', fn, 40);
    dm.debounce('nav', fn, 40);
    const p = dm.debounce('nav', fn, 40);
    await p;
    expect(fn).toHaveBeenCalledTimes(1);
  });

  test('resolves with fn return value', async () => {
    const result = await dm.debounce('nav', () => 42, 10);
    expect(result).toBe(42);
  });

  test('cancel prevents fn from running', async () => {
    const fn = jest.fn();
    dm.debounce('nav', fn, 50);
    const cancelled = dm.cancel('nav');
    expect(cancelled).toBe(true);
    await wait(60);
    expect(fn).not.toHaveBeenCalled();
  });

  test('cancel returns false for unknown key', () => {
    expect(dm.cancel('unknown')).toBe(false);
  });

  test('isPending reflects timer state', async () => {
    const p = dm.debounce('nav', () => {}, 40);
    expect(dm.isPending('nav')).toBe(true);
    await p;
    expect(dm.isPending('nav')).toBe(false);
  });

  test('size returns active timer count', () => {
    dm.debounce('a', () => {}, 100);
    dm.debounce('b', () => {}, 100);
    expect(dm.size()).toBe(2);
    dm.cancelAll();
    expect(dm.size()).toBe(0);
  });

  test('setDefault changes default delay', async () => {
    dm.setDefault(20);
    const fn = jest.fn();
    const p = dm.debounce('nav', fn);
    await p;
    expect(fn).toHaveBeenCalled();
  });
});
