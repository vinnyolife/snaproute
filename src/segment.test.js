import { createSegmentManager } from './segment.js';

let seg;
beforeEach(() => { seg = createSegmentManager(); });

test('get returns correct segment by index', () => {
  expect(seg.get('/users/42/profile', 0)).toBe('users');
  expect(seg.get('/users/42/profile', 1)).toBe('42');
  expect(seg.get('/users/42/profile', 2)).toBe('profile');
});

test('get returns undefined for out-of-bounds index', () => {
  expect(seg.get('/users', 5)).toBeUndefined();
});

test('getAll splits path into segments', () => {
  expect(seg.getAll('/a/b/c')).toEqual(['a', 'b', 'c']);
  expect(seg.getAll('a/b/c')).toEqual(['a', 'b', 'c']);
});

test('count returns number of segments', () => {
  expect(seg.count('/a/b/c')).toBe(3);
  expect(seg.count('/')).toBe(0);
});

test('matches with string value', () => {
  expect(seg.matches('/users/42', 0, 'users')).toBe(true);
  expect(seg.matches('/users/42', 0, 'posts')).toBe(false);
});

test('matches with regex', () => {
  expect(seg.matches('/users/42', 1, /^\d+$/)).toBe(true);
  expect(seg.matches('/users/abc', 1, /^\d+$/)).toBe(false);
});

test('matches with function predicate', () => {
  expect(seg.matches('/users/42', 1, v => v === '42')).toBe(true);
  expect(seg.matches('/users/42', 1, v => v === '99')).toBe(false);
});

test('register and run handlers', () => {
  seg.register(0, s => s.toUpperCase());
  seg.register(1, s => parseInt(s));
  const results = seg.run('/users/7');
  expect(results[0]).toBe('USERS');
  expect(results[1]).toBe(7);
});

test('run skips missing segments', () => {
  seg.register(5, s => s);
  const results = seg.run('/a/b');
  expect(results[5]).toBeUndefined();
});

test('unregister removes handler', () => {
  seg.register(0, s => s);
  seg.unregister(0);
  expect(seg.size()).toBe(0);
});

test('clear removes all handlers', () => {
  seg.register(0, s => s);
  seg.register(1, s => s);
  seg.clear();
  expect(seg.size()).toBe(0);
});

test('register throws on invalid index', () => {
  expect(() => seg.register(-1, s => s)).toThrow();
  expect(() => seg.register('0', s => s)).toThrow();
});

test('register throws on non-function handler', () => {
  expect(() => seg.register(0, 'nope')).toThrow();
});
