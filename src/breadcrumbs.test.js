import { createBreadcrumbs } from './breadcrumbs.js';

describe('createBreadcrumbs', () => {
  let bc;

  beforeEach(() => {
    bc = createBreadcrumbs({ max: 5 });
  });

  test('starts empty', () => {
    expect(bc.get()).toEqual([]);
    expect(bc.size()).toBe(0);
    expect(bc.current()).toBeNull();
  });

  test('push adds a crumb', () => {
    bc.push({ path: '/home', label: 'Home' });
    expect(bc.size()).toBe(1);
    expect(bc.current()).toMatchObject({ path: '/home', label: 'Home' });
  });

  test('push uses path as label if none given', () => {
    bc.push({ path: '/about' });
    expect(bc.current().label).toBe('/about');
  });

  test('push throws without path', () => {
    expect(() => bc.push({ label: 'Oops' })).toThrow();
  });

  test('get returns a copy', () => {
    bc.push({ path: '/a' });
    const trail = bc.get();
    trail.push({ path: '/fake' });
    expect(bc.size()).toBe(1);
  });

  test('pop removes last crumb', () => {
    bc.push({ path: '/a' });
    bc.push({ path: '/b' });
    const popped = bc.pop();
    expect(popped.path).toBe('/b');
    expect(bc.size()).toBe(1);
  });

  test('respects max limit', () => {
    for (let i = 0; i < 7; i++) bc.push({ path: `/page/${i}` });
    expect(bc.size()).toBe(5);
    expect(bc.get()[0].path).toBe('/page/2');
  });

  test('clear empties trail', () => {
    bc.push({ path: '/x' });
    bc.clear();
    expect(bc.size()).toBe(0);
  });

  test('meta is stored on crumb', () => {
    bc.push({ path: '/dashboard', meta: { icon: 'home' } });
    expect(bc.current().meta.icon).toBe('home');
  });
});
