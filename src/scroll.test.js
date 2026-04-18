import { createScrollManager } from './scroll.js';

beforeEach(() => {
  window.scrollTo = vi.fn();
  Object.defineProperty(window, 'scrollX', { value: 0, writable: true });
  Object.defineProperty(window, 'scrollY', { value: 0, writable: true });
});

describe('createScrollManager', () => {
  it('saves and restores scroll position', () => {
    const sm = createScrollManager();
    window.scrollX = 100;
    window.scrollY = 200;
    sm.save('/about');
    sm.restore('/about');
    expect(window.scrollTo).toHaveBeenCalledWith({ left: 100, top: 200, behavior: 'auto' });
  });

  it('scrolls to top when no saved position', () => {
    const sm = createScrollManager();
    sm.restore('/unknown');
    expect(window.scrollTo).toHaveBeenCalledWith({ left: 0, top: 0, behavior: 'auto' });
  });

  it('scrolls to top when restoreOnBack is false', () => {
    const sm = createScrollManager({ restoreOnBack: false });
    window.scrollX = 50;
    window.scrollY = 80;
    sm.save('/home');
    sm.restore('/home');
    expect(window.scrollTo).toHaveBeenCalledWith({ left: 0, top: 0, behavior: 'auto' });
  });

  it('respects custom behavior option', () => {
    const sm = createScrollManager({ behavior: 'smooth' });
    sm.scrollToTop();
    expect(window.scrollTo).toHaveBeenCalledWith({ left: 0, top: 0, behavior: 'smooth' });
  });

  it('clears a specific path', () => {
    const sm = createScrollManager();
    sm.save('/page');
    expect(sm.has('/page')).toBe(true);
    sm.clear('/page');
    expect(sm.has('/page')).toBe(false);
  });

  it('clears all positions', () => {
    const sm = createScrollManager();
    sm.save('/a');
    sm.save('/b');
    sm.clear();
    expect(sm.size()).toBe(0);
  });

  it('reports correct size', () => {
    const sm = createScrollManager();
    sm.save('/x');
    sm.save('/y');
    expect(sm.size()).toBe(2);
  });
});
