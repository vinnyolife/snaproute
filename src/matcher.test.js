import { createMatcher } from './matcher.js';

describe('createMatcher', () => {
  let matcher;

  beforeEach(() => {
    matcher = createMatcher();
  });

  test('matches static route', () => {
    matcher.add('/about', () => 'about');
    const result = matcher.match('/about');
    expect(result.matched).toBe(true);
    expect(result.params).toEqual({});
  });

  test('matches dynamic route and extracts params', () => {
    matcher.add('/users/:id', () => 'user');
    const result = matcher.match('/users/42');
    expect(result.matched).toBe(true);
    expect(result.params).toEqual({ id: '42' });
  });

  test('returns matched false for unknown path', () => {
    const result = matcher.match('/unknown');
    expect(result.matched).toBe(false);
    expect(result.route).toBeNull();
  });

  test('parses query string', () => {
    matcher.add('/search', () => 'search');
    const result = matcher.match('/search?q=hello&page=2');
    expect(result.matched).toBe(true);
    expect(result.query).toEqual({ q: 'hello', page: '2' });
  });

  test('matchAll returns all matching routes', () => {
    matcher.add('/files/:name', () => 'a');
    matcher.add('/files/:slug', () => 'b');
    const results = matcher.matchAll('/files/test');
    expect(results.length).toBe(2);
  });

  test('remove deletes a route', () => {
    matcher.add('/home', () => 'home');
    matcher.remove('/home');
    expect(matcher.match('/home').matched).toBe(false);
  });

  test('clear removes all routes', () => {
    matcher.add('/a', () => {});
    matcher.add('/b', () => {});
    matcher.clear();
    expect(matcher.size()).toBe(0);
  });

  test('size returns route count', () => {
    matcher.add('/x', () => {});
    matcher.add('/y', () => {});
    expect(matcher.size()).toBe(2);
  });

  test('chaining works', () => {
    const result = matcher.add('/a', () => {}).add('/b', () => {});
    expect(result).toBe(matcher);
    expect(matcher.size()).toBe(2);
  });
});
