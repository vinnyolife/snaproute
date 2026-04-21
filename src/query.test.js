import { createQueryManager } from './query.js';

let q;
beforeEach(() => { q = createQueryManager(); });

describe('parse', () => {
  test('parses basic key=value pairs', () => {
    expect(q.parse('?foo=bar&baz=qux')).toEqual({ foo: 'bar', baz: 'qux' });
  });

  test('handles missing leading ?', () => {
    expect(q.parse('a=1&b=2')).toEqual({ a: '1', b: '2' });
  });

  test('handles empty string', () => {
    expect(q.parse('')).toEqual({});
  });

  test('collects repeated keys into array', () => {
    expect(q.parse('?tag=a&tag=b')).toEqual({ tag: ['a', 'b'] });
  });

  test('decodes URI components', () => {
    expect(q.parse('?q=hello%20world')).toEqual({ q: 'hello world' });
  });
});

describe('stringify', () => {
  test('produces query string from object', () => {
    expect(q.stringify({ x: '1', y: '2' })).toBe('?x=1&y=2');
  });

  test('expands array values', () => {
    expect(q.stringify({ tag: ['a', 'b'] })).toBe('?tag=a&tag=b');
  });

  test('returns empty string for empty object', () => {
    expect(q.stringify({})).toBe('');
  });

  test('encodes special characters', () => {
    expect(q.stringify({ q: 'hello world' })).toBe('?q=hello%20world');
  });
});

describe('set / get / has / unset', () => {
  test('set and get params', () => {
    q.set({ page: '2' });
    expect(q.get('page')).toBe('2');
  });

  test('has returns true for existing key', () => {
    q.set({ sort: 'asc' });
    expect(q.has('sort')).toBe(true);
    expect(q.has('missing')).toBe(false);
  });

  test('unset removes keys', () => {
    q.set({ a: '1', b: '2' });
    q.unset('a');
    expect(q.has('a')).toBe(false);
    expect(q.has('b')).toBe(true);
  });

  test('get with no key returns all params', () => {
    q.set({ x: '1', y: '2' });
    expect(q.get()).toEqual({ x: '1', y: '2' });
  });
});

describe('load / merge / clear / toSearch', () => {
  test('load replaces current params', () => {
    q.set({ old: 'val' });
    q.load('?new=1');
    expect(q.has('old')).toBe(false);
    expect(q.get('new')).toBe('1');
  });

  test('merge adds to current params', () => {
    q.set({ a: '1' });
    q.merge('?b=2');
    expect(q.get('a')).toBe('1');
    expect(q.get('b')).toBe('2');
  });

  test('clear empties all params', () => {
    q.set({ a: '1' });
    q.clear();
    expect(q.get()).toEqual({});
  });

  test('toSearch serializes current state', () => {
    q.set({ page: '3', sort: 'desc' });
    const s = q.toSearch();
    expect(s).toContain('page=3');
    expect(s).toContain('sort=desc');
    expect(s.startsWith('?')).toBe(true);
  });
});
