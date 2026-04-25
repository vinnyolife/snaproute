import { createRouter } from './router.js';
import { withTags } from './tags.router.js';

function makeRouter() {
  const base = createRouter();
  return withTags(base);
}

test('addRoute registers route and tags', () => {
  const router = makeRouter();
  router.addRoute('/home', () => 'home', 'public', 'nav');
  expect(router.getTagsForRoute('/home')).toEqual(expect.arrayContaining(['public', 'nav']));
});

test('tag adds tags to existing route', () => {
  const router = makeRouter();
  router.addRoute('/about', () => 'about');
  router.tag('/about', 'public');
  expect(router.getTagsForRoute('/about')).toContain('public');
});

test('untag removes a tag', () => {
  const router = makeRouter();
  router.addRoute('/about', () => 'about', 'public', 'nav');
  router.untag('/about', 'nav');
  expect(router.getTagsForRoute('/about')).not.toContain('nav');
  expect(router.getTagsForRoute('/about')).toContain('public');
});

test('getRoutesByTag returns all routes with that tag', () => {
  const router = makeRouter();
  router.addRoute('/home', () => 'home', 'public');
  router.addRoute('/about', () => 'about', 'public');
  router.addRoute('/admin', () => 'admin', 'private');
  const publicRoutes = router.getRoutesByTag('public');
  expect(publicRoutes).toContain('/home');
  expect(publicRoutes).toContain('/about');
  expect(publicRoutes).not.toContain('/admin');
});

test('resolveTagged includes tags in result', () => {
  const router = makeRouter();
  router.addRoute('/home', () => 'home', 'public', 'nav');
  const result = router.resolveTagged('/home');
  expect(result).not.toBeNull();
  expect(result.tags).toEqual(expect.arrayContaining(['public', 'nav']));
});

test('resolveTagged returns null for unknown path', () => {
  const router = makeRouter();
  expect(router.resolveTagged('/nope')).toBeNull();
});

test('filterByTag filters a list of paths by tag', () => {
  const router = makeRouter();
  router.addRoute('/home', () => 'home', 'public');
  router.addRoute('/about', () => 'about', 'public');
  router.addRoute('/admin', () => 'admin', 'private');
  const filtered = router.filterByTag(['/home', '/about', '/admin'], 'public');
  expect(filtered).toEqual(['/home', '/about']);
});

test('addRoute without tags still works', () => {
  const router = makeRouter();
  router.addRoute('/bare', () => 'bare');
  expect(router.getTagsForRoute('/bare')).toEqual([]);
});
