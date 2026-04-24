import { withPriority } from './priority.router.js';

function makeRouter() {
  const routes = new Map();
  return {
    addRoute(pattern, handler) {
      routes.set(pattern, handler);
    },
    resolve(path, pattern) {
      if (!pattern) return null;
      // naive exact match for tests
      if (pattern === path || pattern === '*') {
        const handler = routes.get(pattern);
        return handler ? { pattern, handler } : null;
      }
      return null;
    },
  };
}

describe('withPriority', () => {
  test('addRoute registers route and priority', () => {
    const router = withPriority(makeRouter());
    router.addRoute('/home', () => 'home', 5);
    expect(router.getPriority('/home')).toBe(5);
  });

  test('setPriority updates existing priority', () => {
    const router = withPriority(makeRouter());
    router.addRoute('/about', () => 'about', 1);
    router.setPriority('/about', 99);
    expect(router.getPriority('/about')).toBe(99);
  });

  test('resolve returns first match by priority', () => {
    const router = withPriority(makeRouter());
    router.addRoute('*', () => 'wildcard', 1);
    router.addRoute('/home', () => 'home', 10);
    const result = router.resolve('/home');
    expect(result.pattern).toBe('/home');
  });

  test('resolve falls back to lower priority if no match', () => {
    const router = withPriority(makeRouter());
    router.addRoute('*', () => 'wildcard', 1);
    router.addRoute('/home', () => 'home', 10);
    const result = router.resolve('/other');
    expect(result.pattern).toBe('*');
  });

  test('resolve returns null when nothing matches', () => {
    const router = withPriority(makeRouter());
    router.addRoute('/only', () => 'only', 5);
    expect(router.resolve('/nope')).toBeNull();
  });

  test('listRoutes returns sorted by priority descending', () => {
    const router = withPriority(makeRouter());
    router.addRoute('/c', () => {}, 1);
    router.addRoute('/a', () => {}, 30);
    router.addRoute('/b', () => {}, 10);
    const list = router.listRoutes();
    expect(list.map(r => r.pattern)).toEqual(['/a', '/b', '/c']);
  });

  test('getPriority defaults to 0 for unregistered pattern', () => {
    const router = withPriority(makeRouter());
    expect(router.getPriority('/ghost')).toBe(0);
  });
});
