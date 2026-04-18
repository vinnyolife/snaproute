import { createPrefetchManager } from './prefetch.js';

describe('createPrefetchManager', () => {
  let manager;

  beforeEach(() => {
    manager = createPrefetchManager();
  });

  test('prefetches a route and stores result', async () => {
    const loader = () => Promise.resolve({ component: 'Home' });
    const result = await manager.prefetch('home', loader);
    expect(result).toEqual({ component: 'Home' });
    expect(manager.isPrefetched('home')).toBe(true);
  });

  test('returns cached result on duplicate prefetch', async () => {
    let callCount = 0;
    const loader = () => { callCount++; return Promise.resolve('data'); };
    await manager.prefetch('route', loader);
    await manager.prefetch('route', loader);
    expect(callCount).toBe(1);
  });

  test('getResult returns stored value', async () => {
    await manager.prefetch('about', () => Promise.resolve(42));
    expect(manager.getResult('about')).toBe(42);
  });

  test('getResult returns null for unknown key', () => {
    expect(manager.getResult('missing')).toBeNull();
  });

  test('isPending is true while loading', () => {
    let resolve;
    const loader = () => new Promise((r) => { resolve = r; });
    manager.prefetch('slow', loader);
    expect(manager.isPending('slow')).toBe(true);
    resolve('done');
  });

  test('isPending is false after load completes', async () => {
    await manager.prefetch('fast', () => Promise.resolve('ok'));
    expect(manager.isPending('fast')).toBe(false);
  });

  test('clear removes a specific key', async () => {
    await manager.prefetch('a', () => Promise.resolve(1));
    manager.clear('a');
    expect(manager.isPrefetched('a')).toBe(false);
    expect(manager.getResult('a')).toBeNull();
  });

  test('clear with no args clears everything', async () => {
    await manager.prefetch('x', () => Promise.resolve(1));
    await manager.prefetch('y', () => Promise.resolve(2));
    manager.clear();
    expect(manager.size()).toBe(0);
  });

  test('handles loader errors gracefully', async () => {
    const loader = () => Promise.reject(new Error('load failed'));
    await expect(manager.prefetch('bad', loader)).rejects.toThrow('load failed');
    expect(manager.isPrefetched('bad')).toBe(false);
    expect(manager.isPending('bad')).toBe(false);
  });
});
