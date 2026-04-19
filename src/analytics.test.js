import { createAnalytics } from './analytics.js';

describe('createAnalytics', () => {
  let analytics;

  beforeEach(() => {
    analytics = createAnalytics();
  });

  test('starts with no entries', () => {
    expect(analytics.size()).toBe(0);
    expect(analytics.getLast()).toBeNull();
  });

  test('trackEnd records an entry', () => {
    analytics.trackEnd('/home', {});
    expect(analytics.size()).toBe(1);
    const entry = analytics.getLast();
    expect(entry.path).toBe('/home');
    expect(entry.timestamp).toBeDefined();
  });

  test('duration is calculated when trackStart called first', () => {
    analytics.trackStart('/about');
    const entry = analytics.trackEnd('/about', {});
    expect(typeof entry.duration).toBe('number');
    expect(entry.duration).toBeGreaterThanOrEqual(0);
  });

  test('duration is null when trackStart path differs', () => {
    analytics.trackStart('/other');
    const entry = analytics.trackEnd('/about', {});
    expect(entry.duration).toBeNull();
  });

  test('getEntries returns a copy', () => {
    analytics.trackEnd('/a');
    analytics.trackEnd('/b');
    const entries = analytics.getEntries();
    expect(entries.length).toBe(2);
    entries.pop();
    expect(analytics.size()).toBe(2);
  });

  test('adapter is called with entry', () => {
    const calls = [];
    analytics.setAdapter((e) => calls.push(e));
    analytics.trackEnd('/test', { id: '1' });
    expect(calls.length).toBe(1);
    expect(calls[0].path).toBe('/test');
    expect(calls[0].params).toEqual({ id: '1' });
  });

  test('adapter error does not throw', () => {
    analytics.setAdapter(() => { throw new Error('oops'); });
    expect(() => analytics.trackEnd('/safe')).not.toThrow();
  });

  test('clear resets everything', () => {
    analytics.trackEnd('/x');
    analytics.clear();
    expect(analytics.size()).toBe(0);
    expect(analytics.getLast()).toBeNull();
  });
});
