import { createNormalizeManager } from './normalize.js';

describe('createNormalizeManager', () => {
  let nm;

  beforeEach(() => {
    nm = createNormalizeManager();
  });

  test('returns / for empty string', () => {
    expect(nm.normalize('')).toBe('/');
  });

  test('returns / for non-string input', () => {
    expect(nm.normalize(null)).toBe('/');
    expect(nm.normalize(undefined)).toBe('/');
  });

  test('ensures leading slash', () => {
    expect(nm.normalize('about')).toBe('/about');
    expect(nm.normalize('foo/bar')).toBe('/foo/bar');
  });

  test('collapses double slashes', () => {
    expect(nm.normalize('//foo//bar')).toBe('/foo/bar');
    expect(nm.normalize('/a///b')).toBe('/a/b');
  });

  test('removes trailing slash by default', () => {
    expect(nm.normalize('/about/')).toBe('/about');
    expect(nm.normalize('/foo/bar/')).toBe('/foo/bar');
  });

  test('preserves root slash when removing trailing slash', () => {
    expect(nm.normalize('/')).toBe('/');
  });

  test('trailingSlash: add appends slash', () => {
    nm.setTrailingSlash('add');
    expect(nm.normalize('/about')).toBe('/about/');
    expect(nm.normalize('/')).toBe('/');
  });

  test('trailingSlash: ignore leaves path unchanged', () => {
    nm.setTrailingSlash('ignore');
    expect(nm.normalize('/about/')).toBe('/about/');
    expect(nm.normalize('/about')).toBe('/about');
  });

  test('throws on invalid trailingSlash mode', () => {
    expect(() => nm.setTrailingSlash('keep')).toThrow();
  });

  test('lowercase option normalizes casing', () => {
    nm.setLowercase(true);
    expect(nm.normalize('/About/US')).toBe('/about/us');
  });

  test('lowercase false leaves casing intact', () => {
    nm.setLowercase(false);
    expect(nm.normalize('/About/US')).toBe('/About/US');
  });

  test('normalizeParts splits pathname and query', () => {
    const result = nm.normalizeParts('/foo/bar/?x=1&y=2');
    expect(result.pathname).toBe('/foo/bar');
    expect(result.query).toBe('?x=1&y=2');
    expect(result.full).toBe('/foo/bar?x=1&y=2');
  });

  test('normalizeParts handles path with no query', () => {
    const result = nm.normalizeParts('/hello/');
    expect(result.pathname).toBe('/hello');
    expect(result.query).toBe('');
    expect(result.full).toBe('/hello');
  });

  test('isSame returns true for equivalent paths', () => {
    expect(nm.isSame('/about/', '/about')).toBe(true);
    expect(nm.isSame('about', '/about')).toBe(true);
  });

  test('isSame returns false for different paths', () => {
    expect(nm.isSame('/about', '/contact')).toBe(false);
  });

  test('exposes current settings via getters', () => {
    expect(nm.lowercase).toBe(false);
    expect(nm.trailingSlash).toBe('remove');
    nm.setLowercase(true);
    nm.setTrailingSlash('add');
    expect(nm.lowercase).toBe(true);
    expect(nm.trailingSlash).toBe('add');
  });
});
