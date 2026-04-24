import { createGroupManager } from './groups.js';

describe('createGroupManager', () => {
  let groups;

  beforeEach(() => {
    groups = createGroupManager();
  });

  test('add and get a group', () => {
    groups.add('admin', { prefix: '/admin', meta: { auth: true } });
    const g = groups.get('admin');
    expect(g.prefix).toBe('/admin');
    expect(g.meta).toEqual({ auth: true });
  });

  test('has returns true for existing group', () => {
    groups.add('api', { prefix: '/api' });
    expect(groups.has('api')).toBe(true);
    expect(groups.has('nope')).toBe(false);
  });

  test('add throws on duplicate name', () => {
    groups.add('shop', { prefix: '/shop' });
    expect(() => groups.add('shop', { prefix: '/shop' })).toThrow('Group "shop" already exists');
  });

  test('applyGroup joins prefix and path', () => {
    groups.add('blog', { prefix: '/blog' });
    expect(groups.applyGroup('blog', '/posts')).toBe('/blog/posts');
    expect(groups.applyGroup('blog', 'tags')).toBe('/blog/tags');
  });

  test('applyGroup collapses double slashes', () => {
    groups.add('v1', { prefix: '/api/v1/' });
    expect(groups.applyGroup('v1', '/users')).toBe('/api/v1/users');
  });

  test('applyGroup throws for unknown group', () => {
    expect(() => groups.applyGroup('ghost', '/x')).toThrow('Group "ghost" not found');
  });

  test('getMeta returns group meta', () => {
    groups.add('secure', { prefix: '/secure', meta: { requiresAuth: true, role: 'admin' } });
    expect(groups.getMeta('secure')).toEqual({ requiresAuth: true, role: 'admin' });
  });

  test('getMeta returns empty object for unknown group', () => {
    expect(groups.getMeta('unknown')).toEqual({});
  });

  test('getGuards returns group guards', () => {
    const guard = () => true;
    groups.add('protected', { prefix: '/protected', guards: [guard] });
    expect(groups.getGuards('protected')).toEqual([guard]);
  });

  test('remove deletes a group', () => {
    groups.add('temp', { prefix: '/temp' });
    expect(groups.remove('temp')).toBe(true);
    expect(groups.has('temp')).toBe(false);
  });

  test('clear removes all groups', () => {
    groups.add('a', { prefix: '/a' });
    groups.add('b', { prefix: '/b' });
    groups.clear();
    expect(groups.size()).toBe(0);
  });

  test('size returns correct count', () => {
    expect(groups.size()).toBe(0);
    groups.add('x', { prefix: '/x' });
    expect(groups.size()).toBe(1);
  });
});
