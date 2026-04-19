import { createNotFoundHandler } from './notfound.js';

describe('createNotFoundHandler', () => {
  let nf;

  beforeEach(() => {
    nf = createNotFoundHandler();
  });

  test('hasHandler returns false initially', () => {
    expect(nf.hasHandler()).toBe(false);
  });

  test('setHandler registers a handler', () => {
    nf.setHandler(() => {});
    expect(nf.hasHandler()).toBe(true);
  });

  test('setHandler throws if not a function', () => {
    expect(() => nf.setHandler('nope')).toThrow(TypeError);
  });

  test('handle returns handled: false when no handler set', () => {
    const result = nf.handle('/missing');
    expect(result).toEqual({ notFound: true, path: '/missing', handled: false });
  });

  test('handle invokes handler and returns handled: true', () => {
    const spy = jest.fn(() => 'rendered');
    nf.setHandler(spy);
    const result = nf.handle('/missing', { extra: 1 });
    expect(spy).toHaveBeenCalledWith({ path: '/missing', extra: 1 });
    expect(result.handled).toBe(true);
    expect(result.result).toBe('rendered');
  });

  test('setFallback stores fallback path', () => {
    nf.setFallback('/home');
    expect(nf.getFallback()).toBe('/home');
  });

  test('setFallback throws if not a string', () => {
    expect(() => nf.setFallback(42)).toThrow(TypeError);
  });

  test('getFallback returns null by default', () => {
    expect(nf.getFallback()).toBeNull();
  });

  test('clear resets handler and fallback', () => {
    nf.setHandler(() => {});
    nf.setFallback('/home');
    nf.clear();
    expect(nf.hasHandler()).toBe(false);
    expect(nf.getFallback()).toBeNull();
  });
});
