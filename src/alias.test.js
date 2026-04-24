import { createAliasManager } from './alias.js';

describe('createAliasManager', () => {
  let aliases;

  beforeEach(() => {
    aliases = createAliasManager();
  });

  test('resolves a simple alias', () => {
    aliases.add('/old', '/new');
    expect(aliases.resolve('/old')).toBe('/new');
  });

  test('returns original path when no alias matches', () => {
    expect(aliases.resolve('/unknown')).toBe('/unknown');
  });

  test('has() returns true for registered alias', () => {
    aliases.add('/a', '/b');
    expect(aliases.has('/a')).toBe(true);
    expect(aliases.has('/b')).toBe(false);
  });

  test('remove() deletes an alias', () => {
    aliases.add('/a', '/b');
    aliases.remove('/a');
    expect(aliases.has('/a')).toBe(false);
    expect(aliases.resolve('/a')).toBe('/a');
  });

  test('clear() removes all aliases', () => {
    aliases.add('/a', '/b').add('/c', '/d');
    aliases.clear();
    expect(aliases.size()).toBe(0);
  });

  test('getAll() returns all alias mappings', () => {
    aliases.add('/x', '/y');
    expect(aliases.getAll()).toEqual({ '/x': '/y' });
  });

  test('resolves wildcard prefix alias', () => {
    aliases.add('/old/*', '/new/*');
    expect(aliases.resolve('/old/page')).toBe('/new/page');
    expect(aliases.resolve('/old/a/b')).toBe('/new/a/b');
  });

  test('wildcard alias with static canonical', () => {
    aliases.add('/legacy/*', '/home');
    expect(aliases.resolve('/legacy/anything')).toBe('/home');
  });

  test('throws on invalid arguments', () => {
    expect(() => aliases.add(123, '/b')).toThrow();
    expect(() => aliases.add('/a', null)).toThrow();
  });

  test('add() is chainable', () => {
    const result = aliases.add('/a', '/b');
    expect(result).toBe(aliases);
  });

  test('size() reflects current count', () => {
    expect(aliases.size()).toBe(0);
    aliases.add('/a', '/b');
    expect(aliases.size()).toBe(1);
  });
});
