import { createBasepathManager } from './basepath.js';

describe('createBasepathManager', () => {
  it('defaults to empty base', () => {
    const bp = createBasepathManager();
    expect(bp.getBase()).toBe('');
  });

  it('normalizes base without leading slash', () => {
    const bp = createBasepathManager('app');
    expect(bp.getBase()).toBe('/app');
  });

  it('strips trailing slash from base', () => {
    const bp = createBasepathManager('/app/');
    expect(bp.getBase()).toBe('/app');
  });

  it('strips basepath from a path', () => {
    const bp = createBasepathManager('/app');
    expect(bp.strip('/app/home')).toBe('/home');
  });

  it('strip returns path unchanged if base not present', () => {
    const bp = createBasepathManager('/app');
    expect(bp.strip('/other/home')).toBe('/other/home');
  });

  it('strip with empty base returns path as-is', () => {
    const bp = createBasepathManager();
    expect(bp.strip('/home')).toBe('/home');
  });

  it('prepends base to path', () => {
    const bp = createBasepathManager('/app');
    expect(bp.prepend('/home')).toBe('/app/home');
  });

  it('prepend adds leading slash if missing', () => {
    const bp = createBasepathManager('/app');
    expect(bp.prepend('home')).toBe('/app/home');
  });

  it('prepend with empty base returns path as-is', () => {
    const bp = createBasepathManager();
    expect(bp.prepend('/home')).toBe('/home');
  });

  it('hasBase returns true when path starts with base', () => {
    const bp = createBasepathManager('/app');
    expect(bp.hasBase('/app/home')).toBe(true);
  });

  it('hasBase returns true for exact base match', () => {
    const bp = createBasepathManager('/app');
    expect(bp.hasBase('/app')).toBe(true);
  });

  it('hasBase returns false when path does not start with base', () => {
    const bp = createBasepathManager('/app');
    expect(bp.hasBase('/other')).toBe(false);
  });

  it('setBase updates the base', () => {
    const bp = createBasepathManager('/app');
    bp.setBase('/v2');
    expect(bp.getBase()).toBe('/v2');
    expect(bp.strip('/v2/home')).toBe('/home');
  });
});
