import { createMetaManager } from './meta.js';

beforeEach(() => {
  document.title = '';
  document.head.innerHTML = '';
});

test('apply sets document title', () => {
  const meta = createMetaManager();
  meta.apply({ title: 'Home' });
  expect(document.title).toBe('Home');
});

test('apply merges with defaults', () => {
  const meta = createMetaManager();
  meta.setDefaults({ title: 'MySite', description: 'default desc' });
  meta.apply({ title: 'About' });
  expect(document.title).toBe('About');
  const el = document.querySelector('meta[name="description"]');
  expect(el.getAttribute('content')).toBe('default desc');
});

test('apply creates meta tags', () => {
  const meta = createMetaManager();
  meta.apply({ description: 'Hello world', keywords: 'js,router' });
  expect(document.querySelector('meta[name="description"]').getAttribute('content')).toBe('Hello world');
  expect(document.querySelector('meta[name="keywords"]').getAttribute('content')).toBe('js,router');
});

test('apply updates existing meta tags', () => {
  const meta = createMetaManager();
  meta.apply({ description: 'First' });
  meta.apply({ description: 'Second' });
  const els = document.querySelectorAll('meta[name="description"]');
  expect(els.length).toBe(1);
  expect(els[0].getAttribute('content')).toBe('Second');
});

test('current returns last applied meta', () => {
  const meta = createMetaManager();
  meta.apply({ title: 'Page A' });
  meta.apply({ title: 'Page B' });
  expect(meta.current().title).toBe('Page B');
});

test('reset clears stack and reapplies defaults', () => {
  const meta = createMetaManager();
  meta.setDefaults({ title: 'Default' });
  meta.apply({ title: 'Other' });
  meta.reset();
  expect(document.title).toBe('Default');
});

test('clear empties the stack', () => {
  const meta = createMetaManager();
  meta.apply({ title: 'X' });
  meta.clear();
  expect(meta.current()).toEqual({});
});

test('og tags use property attribute', () => {
  const meta = createMetaManager();
  meta.apply({ 'og:title': 'OG Title' });
  const el = document.querySelector('meta[property="og:title"]');
  expect(el).not.toBeNull();
  expect(el.getAttribute('content')).toBe('OG Title');
});
