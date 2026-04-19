import { createTitleManager } from './title.js';

describe('createTitleManager', () => {
  let tm;

  beforeEach(() => {
    tm = createTitleManager({ separator: ' | ', defaultTitle: 'MyApp' });
  });

  test('resolve returns default when pattern not registered', () => {
    expect(tm.resolve('/unknown')).toBe('MyApp');
  });

  test('register and resolve a simple title', () => {
    tm.register('/home', 'Home');
    expect(tm.resolve('/home')).toBe('Home');
  });

  test('resolve interpolates params', () => {
    tm.register('/users/:id', 'User :id');
    expect(tm.resolve('/users/:id', { id: '42' })).toBe('User 42');
  });

  test('apply sets document.title with separator', () => {
    tm.register('/about', 'About');
    const result = tm.apply('/about');
    expect(result).toBe('About | MyApp');
    expect(document.title).toBe('About | MyApp');
  });

  test('apply uses custom template', () => {
    tm.setTemplate('{title} — {default}');
    tm.register('/contact', 'Contact');
    const result = tm.apply('/contact');
    expect(result).toBe('Contact — MyApp');
  });

  test('apply falls back to default title when no match', () => {
    tm.apply('/nope');
    expect(document.title).toBe('MyApp');
  });

  test('unregister removes a pattern', () => {
    tm.register('/home', 'Home');
    tm.unregister('/home');
    expect(tm.resolve('/home')).toBe('MyApp');
  });

  test('current returns document.title', () => {
    document.title = 'Test Title';
    expect(tm.current()).toBe('Test Title');
  });

  test('clear resets state', () => {
    tm.register('/home', 'Home');
    tm.setTemplate('{title}');
    tm.clear();
    expect(tm.resolve('/home')).toBe('MyApp');
    tm.register('/home', 'Home');
    const result = tm.apply('/home');
    expect(result).toBe('Home | MyApp');
  });
});
