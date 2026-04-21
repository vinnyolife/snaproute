import { createFallbackManager } from './fallback.js';

describe('createFallbackManager', () => {
  let fb;

  beforeEach(() => {
    fb = createFallbackManager();
  });

  test('returns manager with expected methods', () => {
    expect(typeof fb.add).toBe('function');
    expect(typeof fb.remove).toBe('function');
    expect(typeof fb.setDefault).toBe('function');
    expect(typeof fb.resolve).toBe('function');
    expect(typeof fb.has).toBe('function');
    expect(typeof fb.clear).toBe('function');
    expect(typeof fb.size).toBe('function');
  });

  test('resolve returns null when no fallbacks registered', () => {
    expect(fb.resolve('/missing')).toBeNull();
  });

  test('add and resolve a wildcard fallback', () => {
    fb.add('*', () => '404 page');
    expect(fb.resolve('/anything')).toBe('404 page');
  });

  test('resolve uses prefix match', () => {
    fb.add('/admin', () => 'admin fallback');
    expect(fb.resolve('/admin/unknown')).toBe('admin fallback');
    expect(fb.resolve('/other')).toBeNull();
  });

  test('resolve respects priority order', () => {
    fb.add('*', () => 'low', { priority: 0 });
    fb.add('*', () => 'high', { priority: 10 });
    expect(fb.resolve('/path')).toBe('high');
  });

  test('resolve skips fallback when condition returns false', () => {
    fb.add('*', () => 'conditional', { condition: (path) => path.startsWith('/special') });
    fb.setDefault(() => 'default');
    expect(fb.resolve('/other')).toBe('default');
    expect(fb.resolve('/special/page')).toBe('conditional');
  });

  test('setDefault is used when no fallback matches', () => {
    fb.setDefault((path) => `default for ${path}`);
    expect(fb.resolve('/nope')).toBe('default for /nope');
  });

  test('setDefault throws if not a function', () => {
    expect(() => fb.setDefault('not a function')).toThrow(TypeError);
  });

  test('has returns correct boolean', () => {
    fb.add('/foo', () => {});
    expect(fb.has('/foo')).toBe(true);
    expect(fb.has('/bar')).toBe(false);
  });

  test('remove deletes a fallback', () => {
    fb.add('/foo', () => 'foo');
    fb.remove('/foo');
    expect(fb.has('/foo')).toBe(false);
    expect(fb.size()).toBe(0);
  });

  test('clear removes all fallbacks and default', () => {
    fb.add('*', () => 'a');
    fb.setDefault(() => 'b');
    fb.clear();
    expect(fb.size()).toBe(0);
    expect(fb.resolve('/x')).toBeNull();
  });

  test('add is chainable', () => {
    const result = fb.add('*', () => {});
    expect(result).toBe(fb);
  });
});
