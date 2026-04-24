import { createRetryManager } from './retry.js';

function flushTimers() {
  return new Promise((r) => setTimeout(r, 0));
}

describe('createRetryManager', () => {
  let retry;

  beforeEach(() => {
    retry = createRetryManager();
  });

  test('succeeds on first try', async () => {
    const fn = jest.fn().mockResolvedValue('ok');
    const result = await retry.attempt('/home', fn);
    expect(result).toBe('ok');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  test('retries on failure and eventually succeeds', async () => {
    let calls = 0;
    const fn = jest.fn().mockImplementation(() => {
      calls++;
      if (calls < 3) return Promise.reject(new Error('fail'));
      return Promise.resolve('done');
    });
    retry.setDefault({ delay: 0 });
    const result = await retry.attempt('/page', fn);
    expect(result).toBe('done');
    expect(fn).toHaveBeenCalledTimes(3);
  });

  test('throws after max retries exceeded', async () => {
    const fn = jest.fn().mockRejectedValue(new Error('always fails'));
    retry.setDefault({ max: 2, delay: 0 });
    await expect(retry.attempt('/bad', fn)).rejects.toThrow('always fails');
    expect(fn).toHaveBeenCalledTimes(3);
  });

  test('register overrides defaults for pattern', async () => {
    retry.setDefault({ max: 5, delay: 0 });
    retry.register('/special', { max: 1, delay: 0 });
    const fn = jest.fn().mockRejectedValue(new Error('nope'));
    await expect(retry.attempt('/special', fn)).rejects.toThrow();
    expect(fn).toHaveBeenCalledTimes(2);
  });

  test('getConfig returns per-pattern config', () => {
    retry.register('/a', { max: 4, delay: 50 });
    expect(retry.getConfig('/a')).toEqual({ max: 4, delay: 50 });
  });

  test('getConfig falls back to defaults', () => {
    retry.setDefault({ max: 2, delay: 200 });
    expect(retry.getConfig('/unknown')).toEqual({ max: 2, delay: 200 });
  });

  test('unregister removes pattern config', () => {
    retry.setDefault({ max: 1, delay: 0 });
    retry.register('/tmp', { max: 9, delay: 0 });
    retry.unregister('/tmp');
    expect(retry.getConfig('/tmp')).toEqual({ max: 1, delay: 0 });
  });

  test('clear removes all registered configs', () => {
    retry.register('/a', { max: 1, delay: 0 });
    retry.register('/b', { max: 2, delay: 0 });
    retry.clear();
    expect(retry.size()).toBe(0);
  });

  test('size reflects registered count', () => {
    expect(retry.size()).toBe(0);
    retry.register('/x', {});
    retry.register('/y', {});
    expect(retry.size()).toBe(2);
  });
});
