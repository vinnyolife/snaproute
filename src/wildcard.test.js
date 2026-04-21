import { createWildcardManager } from './wildcard.js';

describe('createWildcardManager', () => {
  let wm;

  beforeEach(() => {
    wm = createWildcardManager();
  });

  test('add and match single-segment wildcard', () => {
    wm.add('/files/*', () => 'files');
    const result = wm.match('/files/readme.txt');
    expect(result).not.toBeNull();
    expect(result.wildcard).toBe('readme.txt');
    expect(result.pattern).toBe('/files/*');
  });

  test('single wildcard does not match slashes', () => {
    wm.add('/files/*', () => {});
    expect(wm.match('/files/a/b')).toBeNull();
  });

  test('add and match double-star wildcard', () => {
    wm.add('/docs/**', () => 'docs');
    const result = wm.match('/docs/api/v2/index.html');
    expect(result).not.toBeNull();
    expect(result.wildcard).toBe('api/v2/index.html');
  });

  test('match returns null when no pattern matches', () => {
    wm.add('/files/*', () => {});
    expect(wm.match('/other/path')).toBeNull();
  });

  test('matchAll returns all matching entries', () => {
    wm.add('/assets/*', () => 'a');
    wm.add('/assets/**', () => 'b');
    const results = wm.matchAll('/assets/img/logo.png');
    expect(results.length).toBe(1); // only ** matches nested
    expect(results[0].pattern).toBe('/assets/**');
  });

  test('remove deletes a pattern', () => {
    wm.add('/files/*', () => {});
    wm.remove('/files/*');
    expect(wm.match('/files/test.js')).toBeNull();
  });

  test('clear removes all patterns', () => {
    wm.add('/a/*', () => {});
    wm.add('/b/**', () => {});
    wm.clear();
    expect(wm.size()).toBe(0);
  });

  test('size reflects current count', () => {
    expect(wm.size()).toBe(0);
    wm.add('/x/*', () => {});
    expect(wm.size()).toBe(1);
  });

  test('add throws on invalid pattern', () => {
    expect(() => wm.add(123, () => {})).toThrow(TypeError);
  });

  test('add throws on non-function handler', () => {
    expect(() => wm.add('/a/*', 'nope')).toThrow(TypeError);
  });

  test('handler is called with match info', () => {
    const handler = jest.fn();
    wm.add('/static/*', handler);
    const result = wm.match('/static/app.js');
    result.handler(result);
    expect(handler).toHaveBeenCalledWith(expect.objectContaining({ wildcard: 'app.js' }));
  });
});
