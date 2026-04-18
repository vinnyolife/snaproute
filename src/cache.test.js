import { createCache } from './cache.js';

describe('createCache', () => {
  test('stores and retrieves values', () => {
    const cache = createCache();
    cache.set('a', 42);
    expect(cache.get('a')).toBe(42);
  });

  test('returns undefined for missing keys', () => {
    const cache = createCache();
    expect(cache.get('nope')).toBeUndefined();
  });

  test('has() reflects presence', () => {
    const cache = createCache();
    cache.set('x', 1);
    expect(cache.has('x')).toBe(true);
    expect(cache.has('y')).toBe(false);
  });

  test('remove() deletes a key', () => {
    const cache = createCache();
    cache.set('k', 'v');
    cache.remove('k');
    expect(cache.has('k')).toBe(false);
  });

  test('clear() empties the cache', () => {
    const cache = createCache();
    cache.set('a', 1);
    cache.set('b', 2);
    cache.clear();
    expect(cache.size()).toBe(0);
  });

  test('evicts oldest entry when maxSize is exceeded', () => {
    const cache = createCache({ maxSize: 2 });
    cache.set('a', 1);
    cache.set('b', 2);
    cache.set('c', 3);
    expect(cache.has('a')).toBe(false);
    expect(cache.has('b')).toBe(true);
    expect(cache.has('c')).toBe(true);
  });

  test('TTL expiry returns undefined', async () => {
    const cache = createCache({ ttl: 20 });
    cache.set('t', 'hello');
    expect(cache.get('t')).toBe('hello');
    await new Promise(r => setTimeout(r, 30));
    expect(cache.get('t')).toBeUndefined();
  });

  test('keys() returns current keys', () => {
    const cache = createCache();
    cache.set('a', 1);
    cache.set('b', 2);
    expect(cache.keys()).toEqual(['a', 'b']);
  });

  test('size() tracks count', () => {
    const cache = createCache();
    cache.set('a', 1);
    cache.set('b', 2);
    expect(cache.size()).toBe(2);
  });
});
