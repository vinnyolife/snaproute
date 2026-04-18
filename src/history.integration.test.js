/**
 * Integration test: history + router working together
 */
import { createHistory } from './history.js';
import { createRouter } from './router.js';

const mockHistory = { pushState: jest.fn(), replaceState: jest.fn() };
const mockLocation = { pathname: '/', search: '', hash: '' };
const popListeners = [];

beforeAll(() => {
  global.window = {
    history: mockHistory,
    location: mockLocation,
    addEventListener: (e, fn) => { if (e === 'popstate') popListeners.push(fn); },
    removeEventListener: () => {}
  };
});

beforeEach(() => jest.clearAllMocks());

test('router resolves route when history push is called', () => {
  const history = createHistory();
  const router = createRouter();
  const handler = jest.fn();

  router.addRoute('/users/:id', handler);
  history.listen(({ path }) => router.resolve(path));

  history.push('/users/99');

  expect(handler).toHaveBeenCalledWith(
    expect.objectContaining({ params: { id: '99' } })
  );
});

test('router resolves on popstate event', () => {
  const history = createHistory();
  const router = createRouter();
  const handler = jest.fn();

  router.addRoute('/home', handler);
  history.listen(({ path }) => router.resolve(path));

  mockLocation.pathname = '/home';
  mockLocation.search = '';
  mockLocation.hash = '';
  popListeners.forEach(fn => fn({ state: {} }));

  expect(handler).toHaveBeenCalled();
});

test('multiple listeners can coexist', () => {
  const history = createHistory();
  const log = [];
  const l1 = ({ path }) => log.push('l1:' + path);
  const l2 = ({ path }) => log.push('l2:' + path);
  history.listen(l1);
  history.listen(l2);
  history.push('/multi');
  expect(log).toEqual(['l1:/multi', 'l2:/multi']);
});
