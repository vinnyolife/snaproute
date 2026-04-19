import { withTitle } from './title.router.js';

function makeRouter() {
  const routes = new Map();
  return {
    addRoute(pattern, handler) {
      routes.set(pattern, handler);
    },
    resolve(path) {
      for (const [pattern, handler] of routes) {
        const keys = [];
        const regexStr = pattern.replace(/:([a-zA-Z_]+)/g, (_, k) => {
          keys.push(k);
          return '([^/]+)';
        });
        const match = path.match(new RegExp(`^${regexStr}$`));
        if (match) {
          const params = {};
          keys.forEach((k, i) => { params[k] = match[i + 1]; });
          return { pattern, handler, params };
        }
      }
      return null;
    },
  };
}

describe('withTitle', () => {
  let router;

  beforeEach(() => {
    router = withTitle(makeRouter(), { defaultTitle: 'App', separator: ' - ' });
  });

  test('addRoute with meta.title registers title', () => {
    router.addRoute('/home', () => {}, { title: 'Home' });
    router.resolve('/home');
    expect(document.title).toBe('Home - App');
  });

  test('resolve updates document.title with params', () => {
    router.addRoute('/items/:id', () => {}, { title: 'Item :id' });
    router.resolve('/items/7');
    expect(document.title).toBe('Item 7 - App');
  });

  test('resolve with no title match leaves default', () => {
    router.addRoute('/plain', () => {});
    router.resolve('/plain');
    expect(document.title).toBe('App');
  });

  test('currentTitle returns document.title', () => {
    router.addRoute('/about', () => {}, { title: 'About' });
    router.resolve('/about');
    expect(router.currentTitle()).toBe('About - App');
  });

  test('setTemplate applies custom format', () => {
    router.setTemplate('{title} :: {default}');
    router.addRoute('/contact', () => {}, { title: 'Contact' });
    router.resolve('/contact');
    expect(document.title).toBe('Contact :: App');
  });

  test('setDefault changes fallback title', () => {
    router.setDefault('NewApp');
    router.addRoute('/x', () => {}, { title: 'X' });
    router.resolve('/x');
    expect(document.title).toBe('X - NewApp');
  });
});
