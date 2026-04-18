import { createHistory } from './history.js';

const mockListeners = [];
const mockHistory = { pushState: jest.fn(), replaceState: jest.fn(), back: jest.fn(), forward: jest.fn() };
const mockLocation = { pathname: '/test', search: '', hash: '' };

beforeAll(() => {
  global.window = {
    history: mockHistory,
    location: mockLocation,
    addEventListener: (e, fn) => mockListeners.push({ e, fn }),
    removeEventListener: (e, fn) => {
      const idx = mockListeners.findIndex(l => l.e === e && l.fn === fn);
      if (idx !== -1) mockListeners.splice(idx, 1);
    }
  };
});

beforeEach(() => jest.clearAllMocks());

test('getCurrentPath returns pathname + search + hash', () => {
  const history = createHistory();
  mockLocation.pathname = '/foo';
  mockLocation.search = '?bar=1';
  mockLocation.hash = '#baz';
  expect(history.getCurrentPath()).toBe('/foo?bar=1#baz');
});

test('push calls pushState and notifies listeners', () => {
  const history = createHistory();
  const listener = jest.fn();
  history.listen(listener);
  history.push('/about', { from: 'home' });
  expect(mockHistory.pushState).toHaveBeenCalledWith({ from: 'home' }, '', '/about');
  expect(listener).toHaveBeenCalledWith({ path: '/about', state: { from: 'home' } });
});

test('replace calls replaceState and notifies listeners', () => {
  const history = createHistory();
  const listener = jest.fn();
  history.listen(listener);
  history.replace('/home');
  expect(mockHistory.replaceState).toHaveBeenCalledWith({}, '', '/home');
  expect(listener).toHaveBeenCalledWith({ path: '/home', state: {} });
});

test('unlisten removes listener', () => {
  const history = createHistory();
  const listener = jest.fn();
  const unlisten = history.listen(listener);
  unlisten();
  history.push('/gone');
  expect(listener).not.toHaveBeenCalled();
});

test('destroy clears all listeners', () => {
  const history = createHistory();
  const l1 = jest.fn();
  const l2 = jest.fn();
  history.listen(l1);
  history.listen(l2);
  history.destroy();
  history.push('/after-destroy');
  expect(l1).not.toHaveBeenCalled();
  expect(l2).not.toHaveBeenCalled();
});
