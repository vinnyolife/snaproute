import { createScopeManager } from './scope.js';

describe('createScopeManager', () => {
  let scope;

  beforeEach(() => {
    scope = createScopeManager();
  });

  test('add and get a scope', () => {
    scope.add('admin', '/admin');
    expect(scope.get('admin')).toEqual({ prefix: '/admin', meta: {} });
  });

  test('normalizes prefix without leading slash', () => {
    scope.add('api', 'api');
    expect(scope.get('api').prefix).toBe('/api');
  });

  test('add stores meta', () => {
    scope.add('user', '/user', { auth: true });
    expect(scope.get('user').meta).toEqual({ auth: true });
  });

  test('has returns true for known scope', () => {
    scope.add('shop', '/shop');
    expect(scope.has('shop')).toBe(true);
    expect(scope.has('missing')).toBe(false);
  });

  test('remove deletes a scope', () => {
    scope.add('tmp', '/tmp');
    scope.remove('tmp');
    expect(scope.has('tmp')).toBe(false);
  });

  test('resolve prepends prefix to path', () => {
    scope.add('admin', '/admin');
    expect(scope.resolve('admin', '/users')).toBe('/admin/users');
  });

  test('resolve adds leading slash to path if missing', () => {
    scope.add('admin', '/admin');
    expect(scope.resolve('admin', 'dashboard')).toBe('/admin/dashboard');
  });

  test('resolve returns path unchanged for unknown scope', () => {
    expect(scope.resolve('ghost', '/path')).toBe('/path');
  });

  test('strip removes prefix from path', () => {
    scope.add('admin', '/admin');
    expect(scope.strip('admin', '/admin/users')).toBe('/users');
  });

  test('strip returns path unchanged if prefix does not match', () => {
    scope.add('admin', '/admin');
    expect(scope.strip('admin', '/other/path')).toBe('/other/path');
  });

  test('matchScope finds the matching scope', () => {
    scope.add('admin', '/admin', { role: 'admin' });
    scope.add('api', '/api');
    const result = scope.matchScope('/admin/settings');
    expect(result).toEqual({ name: 'admin', prefix: '/admin', meta: { role: 'admin' } });
  });

  test('matchScope returns null when no match', () => {
    scope.add('admin', '/admin');
    expect(scope.matchScope('/public')).toBeNull();
  });

  test('list returns all scopes', () => {
    scope.add('a', '/a');
    scope.add('b', '/b');
    expect(scope.list()).toHaveLength(2);
  });

  test('clear removes all scopes', () => {
    scope.add('x', '/x');
    scope.clear();
    expect(scope.size()).toBe(0);
  });

  test('add throws on invalid name', () => {
    expect(() => scope.add('', '/x')).toThrow();
  });

  test('add throws on invalid prefix', () => {
    expect(() => scope.add('x', '')).toThrow();
  });
});
