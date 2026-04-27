import { createBlacklistManager } from './blacklist.js';

let bl;
beforeEach(() => {
  bl = createBlacklistManager();
});

test('blocks an exact path', () => {
  bl.add('/admin');
  expect(bl.isBlocked('/admin')).toBe(true);
  expect(bl.isBlocked('/home')).toBe(false);
});

test('blocks via regex pattern', () => {
  bl.add(/^\/secret/);
  expect(bl.isBlocked('/secret/data')).toBe(true);
  expect(bl.isBlocked('/public')).toBe(false);
});

test('remove exact path', () => {
  bl.add('/admin');
  bl.remove('/admin');
  expect(bl.isBlocked('/admin')).toBe(false);
});

test('remove regex pattern', () => {
  const re = /^\/secret/;
  bl.add(re);
  bl.remove(re);
  expect(bl.isBlocked('/secret/data')).toBe(false);
});

test('size reflects exact and pattern entries', () => {
  bl.add('/admin');
  bl.add(/^\/secret/);
  expect(bl.size()).toBe(2);
});

test('list returns all entries', () => {
  const re = /^\/secret/;
  bl.add('/admin');
  bl.add(re);
  const l = bl.list();
  expect(l).toContain('/admin');
  expect(l).toContain(re);
});

test('clear removes everything', () => {
  bl.add('/admin');
  bl.add(/^\/secret/);
  bl.clear();
  expect(bl.size()).toBe(0);
  expect(bl.isBlocked('/admin')).toBe(false);
});

test('chaining works', () => {
  const result = bl.add('/a').add('/b').remove('/a');
  expect(result).toBe(bl);
  expect(bl.isBlocked('/a')).toBe(false);
  expect(bl.isBlocked('/b')).toBe(true);
});
