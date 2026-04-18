import { createScrollManager } from './scroll.js';
import { createHistory } from './history.js';

beforeEach(() => {
  window.scrollTo = vi.fn();
  Object.defineProperty(window, 'scrollX', { value: 0, writable: true });
  Object.defineProperty(window, 'scrollY', { value: 0, writable: true });
  window.history.replaceState(null, '', '/');
});

describe('scroll + history integration', () => {
  it('saves position before navigation and restores on back', () => {
    const history = createHistory();
    const scroll = createScrollManager();

    window.scrollY = 300;
    scroll.save(history.getCurrentPath());

    history.push('/page2');
    window.scrollY = 0;
    scroll.save(history.getCurrentPath());

    history.back();
    scroll.restore('/');

    expect(window.scrollTo).toHaveBeenCalledWith({ left: 0, top: 300, behavior: 'auto' });
  });

  it('scrolls to top on fresh navigation', () => {
    const history = createHistory();
    const scroll = createScrollManager();

    history.push('/new-page');
    scroll.restore('/new-page');

    expect(window.scrollTo).toHaveBeenCalledWith({ left: 0, top: 0, behavior: 'auto' });
  });
});
