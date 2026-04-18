import { parsePattern, extractParams, parseQuery } from './params.js';

describe('parsePattern', () => {
  test('static route produces regex with no keys', () => {
    const { regex, keys } = parsePattern('/about');
    expect(keys).toEqual([]);
    expect(regex.test('/about')).toBe(true);
    expect(regex.test('/about/more')).toBe(false);
  });

  test('single param', () => {
    const { regex, keys } = parsePattern('/users/:id');
    expect(keys).toEqual(['id']);
    expect(regex.test('/users/42')).toBe(true);
    expect(regex.test('/users/')).toBe(false);
  });

  test('multiple params', () => {
    const { keys } = parsePattern('/users/:userId/posts/:postId');
    expect(keys).toEqual(['userId', 'postId']);
  });
});

describe('extractParams', () => {
  test('returns null on no match', () => {
    const parsed = parsePattern('/users/:id');
    expect(extractParams(parsed, '/posts/5')).toBeNull();
  });

  test('extracts single param', () => {
    const parsed = parsePattern('/users/:id');
    expect(extractParams(parsed, '/users/99')).toEqual({ id: '99' });
  });

  test('extracts multiple params', () => {
    const parsed = parsePattern('/users/:userId/posts/:postId');
    expect(extractParams(parsed, '/users/3/posts/7')).toEqual({
      userId: '3',
      postId: '7',
    });
  });

  test('decodes URI components', () => {
    const parsed = parsePattern('/search/:term');
    expect(extractParams(parsed, '/search/hello%20world')).toEqual({
      term: 'hello world',
    });
  });
});

describe('parseQuery', () => {
  test('empty string returns empty object', () => {
    expect(parseQuery('')).toEqual({});
  });

  test('parses simple key=value pairs', () => {
    expect(parseQuery('?foo=bar&baz=1')).toEqual({ foo: 'bar', baz: '1' });
  });

  test('works without leading ?', () => {
    expect(parseQuery('x=1&y=2')).toEqual({ x: '1', y: '2' });
  });

  test('decodes encoded values', () => {
    expect(parseQuery('?q=hello%20world')).toEqual({ q: 'hello world' });
  });

  test('handles key with no value', () => {
    expect(parseQuery('?flag')).toEqual({ flag: '' });
  });
});
