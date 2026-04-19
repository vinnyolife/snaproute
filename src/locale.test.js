import { createLocaleManager } from './locale.js';

const makeLocale = (opts) =>
  createLocaleManager({ supported: ['en', 'fr', 'de'], default: 'en', ...opts });

describe('createLocaleManager', () => {
  test('detects locale from path', () => {
    const lm = makeLocale();
    expect(lm.detect('/fr/about')).toBe('fr');
    expect(lm.detect('/en/home')).toBe('en');
    expect(lm.detect('/about')).toBeNull();
  });

  test('strips locale from path', () => {
    const lm = makeLocale();
    expect(lm.strip('/fr/about')).toEqual({ locale: 'fr', path: '/about' });
    expect(lm.strip('/en/')).toEqual({ locale: 'en', path: '/' });
  });

  test('falls back to default locale when none found', () => {
    const lm = makeLocale();
    expect(lm.strip('/about')).toEqual({ locale: 'en', path: '/about' });
  });

  test('strip returns null locale when fallback disabled', () => {
    const lm = makeLocale({ fallback: false });
    expect(lm.strip('/about')).toEqual({ locale: null, path: '/about' });
  });

  test('prefix adds locale to path', () => {
    const lm = makeLocale({ prefixDefault: true });
    expect(lm.prefix('fr', '/about')).toBe('/fr/about');
    expect(lm.prefix('en', '/home')).toBe('/en/home');
  });

  test('prefix skips default locale when prefixDefault is false', () => {
    const lm = makeLocale();
    expect(lm.prefix('en', '/home')).toBe('/home');
    expect(lm.prefix('fr', '/home')).toBe('/fr/home');
  });

  test('setCurrent and getCurrent', () => {
    const lm = makeLocale();
    expect(lm.getCurrent()).toBe('en');
    lm.setCurrent('de');
    expect(lm.getCurrent()).toBe('de');
  });

  test('setCurrent throws for unsupported locale', () => {
    const lm = makeLocale();
    expect(() => lm.setCurrent('es')).toThrow('Unsupported locale: es');
  });

  test('getSupported returns copy of supported locales', () => {
    const lm = makeLocale();
    expect(lm.getSupported()).toEqual(['en', 'fr', 'de']);
  });
});
