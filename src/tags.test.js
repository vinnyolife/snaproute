import { createTagManager } from './tags.js';

let tags;
beforeEach(() => { tags = createTagManager(); });

test('add and getTags', () => {
  tags.add('/home', 'public', 'nav');
  expect(tags.getTags('/home')).toEqual(expect.arrayContaining(['public', 'nav']));
});

test('getRoutes by tag', () => {
  tags.add('/home', 'public');
  tags.add('/about', 'public');
  expect(tags.getRoutes('public')).toEqual(expect.arrayContaining(['/home', '/about']));
});

test('hasTag returns true/false correctly', () => {
  tags.add('/home', 'public');
  expect(tags.hasTag('/home', 'public')).toBe(true);
  expect(tags.hasTag('/home', 'private')).toBe(false);
});

test('matchAny returns true if any tag matches', () => {
  tags.add('/home', 'public', 'nav');
  expect(tags.matchAny('/home', ['nav', 'admin'])).toBe(true);
  expect(tags.matchAny('/home', ['admin', 'secret'])).toBe(false);
});

test('matchAll returns true only if all tags match', () => {
  tags.add('/home', 'public', 'nav');
  expect(tags.matchAll('/home', ['public', 'nav'])).toBe(true);
  expect(tags.matchAll('/home', ['public', 'admin'])).toBe(false);
});

test('remove deletes specific tags', () => {
  tags.add('/home', 'public', 'nav');
  tags.remove('/home', 'nav');
  expect(tags.hasTag('/home', 'nav')).toBe(false);
  expect(tags.hasTag('/home', 'public')).toBe(true);
});

test('remove also cleans up tagRoutes index', () => {
  tags.add('/home', 'public');
  tags.remove('/home', 'public');
  expect(tags.getRoutes('public')).not.toContain('/home');
});

test('clear removes all tags for a route', () => {
  tags.add('/home', 'public', 'nav');
  tags.clear('/home');
  expect(tags.getTags('/home')).toEqual([]);
  expect(tags.getRoutes('public')).not.toContain('/home');
});

test('clearAll resets everything', () => {
  tags.add('/home', 'public');
  tags.add('/about', 'public');
  tags.clearAll();
  expect(tags.size()).toBe(0);
  expect(tags.getRoutes('public')).toEqual([]);
});

test('size reflects number of tagged routes', () => {
  expect(tags.size()).toBe(0);
  tags.add('/home', 'a');
  tags.add('/about', 'b');
  expect(tags.size()).toBe(2);
});

test('getTags returns empty array for unknown route', () => {
  expect(tags.getTags('/unknown')).toEqual([]);
});

test('add is idempotent - duplicate tags are not added twice', () => {
  tags.add('/home', 'public', 'public');
  const routeTags = tags.getTags('/home');
  const publicCount = routeTags.filter(t => t === 'public').length;
  expect(publicCount).toBe(1);

  // calling add again with the same tag should not duplicate it
  tags.add('/home', 'public');
  const routeTagsAfter = tags.getTags('/home');
  const publicCountAfter = routeTagsAfter.filter(t => t === 'public').length;
  expect(publicCountAfter).toBe(1);
});
