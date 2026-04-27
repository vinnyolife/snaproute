import { createThrottleManager } from './throttle.js';

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

describe('createThrottleManager', () => {
  let throttle;

  beforeEach(() => {
    throttle = createThrottleManager();
  });

  test('allows navigation when no limit is set', () => {
    expect(throttle.isThrottled('/home')).toBe(false);
    expect(throttle.attempt('/home')).toBe(true);
  });

  test('setLimit registers a limit for a route', () => {
    throttle.setLimit('/home', 500);
    expect(throttle.size()).toBe(1);
  });

  test('throws on invalid limit', () => {
    expect(() => throttle.setLimit('/home', -1)).toThrow();
    expect(() => throttle.setLimit('/home', 'fast')).toThrow();
  });

  test('attempt returns true on first call then false within window', () => {
    throttle.setLimit('/home', 300);
    expect(throttle.attempt('/home')).toBe(true);
    expect(throttle.attempt('/home')).toBe(false);
    expect(throttle.isThrottled('/home')).toBe(true);
  });

  test('attempt returns true again after throttle window expires', async () => {
    throttle.setLimit('/fast', 50);
    expect(throttle.attempt('/fast')).toBe(true);
    expect(throttle.attempt('/fast')).toBe(false);
    await wait(60);
    expect(throttle.attempt('/fast')).toBe(true);
  });

  test('remainingTime returns 0 when not throttled', () => {
    throttle.setLimit('/home', 300);
    expect(throttle.remainingTime('/home')).toBe(0);
  });

  test('remainingTime returns positive value when throttled', () => {
    throttle.setLimit('/home', 300);
    throttle.attempt('/home');
    expect(throttle.remainingTime('/home')).toBeGreaterThan(0);
    expect(throttle.remainingTime('/home')).toBeLessThanOrEqual(300);
  });

  test('remove clears limit and last call for a route', () => {
    throttle.setLimit('/home', 300);
    throttle.attempt('/home');
    throttle.remove('/home');
    expect(throttle.isThrottled('/home')).toBe(false);
    expect(throttle.size()).toBe(0);
  });

  test('clear removes all limits', () => {
    throttle.setLimit('/a', 100);
    throttle.setLimit('/b', 200);
    throttle.clear();
    expect(throttle.size()).toBe(0);
    expect(throttle.isThrottled('/a')).toBe(false);
  });

  test('independent routes do not interfere', () => {
    throttle.setLimit('/a', 500);
    throttle.setLimit('/b', 500);
    throttle.attempt('/a');
    expect(throttle.isThrottled('/a')).toBe(true);
    expect(throttle.isThrottled('/b')).toBe(false);
  });
});
