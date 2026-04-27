import { createCheckpointManager } from './checkpoint.js';

describe('createCheckpointManager', () => {
  let cp;

  beforeEach(() => {
    cp = createCheckpointManager();
  });

  test('saves and restores a checkpoint', () => {
    cp.save('home', '/home', { scroll: 0 });
    const result = cp.restore('home');
    expect(result.path).toBe('/home');
    expect(result.state).toEqual({ scroll: 0 });
    expect(result.name).toBe('home');
  });

  test('restore returns null for unknown checkpoint', () => {
    expect(cp.restore('nope')).toBeNull();
  });

  test('has returns true/false correctly', () => {
    cp.save('a', '/a');
    expect(cp.has('a')).toBe(true);
    expect(cp.has('b')).toBe(false);
  });

  test('remove deletes a checkpoint', () => {
    cp.save('x', '/x');
    expect(cp.remove('x')).toBe(true);
    expect(cp.has('x')).toBe(false);
  });

  test('remove returns false for unknown checkpoint', () => {
    expect(cp.remove('ghost')).toBe(false);
  });

  test('clear removes all checkpoints', () => {
    cp.save('a', '/a');
    cp.save('b', '/b');
    cp.clear();
    expect(cp.size()).toBe(0);
  });

  test('list returns all checkpoints', () => {
    cp.save('a', '/a');
    cp.save('b', '/b');
    const items = cp.list();
    expect(items).toHaveLength(2);
    expect(items.map(i => i.name)).toContain('a');
  });

  test('size reflects current count', () => {
    expect(cp.size()).toBe(0);
    cp.save('a', '/a');
    expect(cp.size()).toBe(1);
  });

  test('save throws on invalid name', () => {
    expect(() => cp.save('', '/path')).toThrow();
    expect(() => cp.save(null, '/path')).toThrow();
  });

  test('save throws on invalid path', () => {
    expect(() => cp.save('x', '')).toThrow();
  });

  test('rename moves a checkpoint to new name', () => {
    cp.save('old', '/old');
    expect(cp.rename('old', 'new')).toBe(true);
    expect(cp.has('old')).toBe(false);
    expect(cp.restore('new').path).toBe('/old');
  });

  test('rename returns false for unknown checkpoint', () => {
    expect(cp.rename('ghost', 'new')).toBe(false);
  });

  test('savedAt is set on save', () => {
    const before = Date.now();
    cp.save('t', '/t');
    const after = Date.now();
    const { savedAt } = cp.restore('t');
    expect(savedAt).toBeGreaterThanOrEqual(before);
    expect(savedAt).toBeLessThanOrEqual(after);
  });
});
