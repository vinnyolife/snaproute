import { createPriorityManager } from './priority.js';

describe('createPriorityManager', () => {
  let pm;

  beforeEach(() => {
    pm = createPriorityManager();
  });

  test('get returns 0 for unknown pattern', () => {
    expect(pm.get('/unknown')).toBe(0);
  });

  test('set and get a priority', () => {
    pm.set('/admin', 10);
    expect(pm.get('/admin')).toBe(10);
  });

  test('set throws for non-number priority', () => {
    expect(() => pm.set('/x', 'high')).toThrow(TypeError);
  });

  test('remove deletes a priority', () => {
    pm.set('/about', 5);
    pm.remove('/about');
    expect(pm.get('/about')).toBe(0);
  });

  test('clear removes all priorities', () => {
    pm.set('/a', 1);
    pm.set('/b', 2);
    pm.clear();
    expect(pm.size()).toBe(0);
  });

  test('sort orders patterns by descending priority', () => {
    pm.set('/low', 1);
    pm.set('/high', 10);
    pm.set('/mid', 5);
    const sorted = pm.sort(['/low', '/high', '/mid']);
    expect(sorted).toEqual(['/high', '/mid', '/low']);
  });

  test('sort treats unknown patterns as priority 0', () => {
    pm.set('/known', 3);
    const sorted = pm.sort(['/unknown', '/known']);
    expect(sorted).toEqual(['/known', '/unknown']);
  });

  test('sortRoutes works with route objects', () => {
    pm.set('/api', 20);
    pm.set('/home', 5);
    const routes = [{ pattern: '/home' }, { pattern: '/api' }, { pattern: '/other' }];
    const sorted = pm.sortRoutes(routes);
    expect(sorted[0].pattern).toBe('/api');
    expect(sorted[1].pattern).toBe('/home');
    expect(sorted[2].pattern).toBe('/other');
  });

  test('entries returns all set priorities', () => {
    pm.set('/x', 7);
    pm.set('/y', 3);
    const e = pm.entries();
    expect(e).toHaveLength(2);
    expect(e).toContainEqual({ pattern: '/x', priority: 7 });
  });

  test('size reflects current count', () => {
    expect(pm.size()).toBe(0);
    pm.set('/a', 1);
    expect(pm.size()).toBe(1);
  });
});
