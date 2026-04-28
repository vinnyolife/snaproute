import { createBatchManager } from './batch.js';

function makeRouter(resolveMap = {}) {
  return {
    resolve: (path) => {
      if (resolveMap[path] !== undefined) {
        if (resolveMap[path] instanceof Error) return Promise.reject(resolveMap[path]);
        return Promise.resolve(resolveMap[path]);
      }
      return Promise.resolve({ path });
    },
    navigate: jest.fn(),
  };
}

describe('createBatchManager', () => {
  test('add queues paths', () => {
    const b = createBatchManager(makeRouter());
    b.add('/a').add('/b');
    expect(b.size()).toBe(2);
  });

  test('peek returns copy of queue', () => {
    const b = createBatchManager(makeRouter());
    b.add('/x', { navigate: true });
    const peeked = b.peek();
    expect(peeked).toHaveLength(1);
    expect(peeked[0].path).toBe('/x');
  });

  test('clear empties the queue', () => {
    const b = createBatchManager(makeRouter());
    b.add('/a').add('/b').clear();
    expect(b.size()).toBe(0);
  });

  test('flush resolves all queued paths', async () => {
    const router = makeRouter({ '/a': { name: 'a' }, '/b': { name: 'b' } });
    const b = createBatchManager(router);
    b.add('/a').add('/b');
    const results = await b.flush();
    expect(results).toHaveLength(2);
    expect(results[0].result).toEqual({ name: 'a' });
    expect(results[1].result).toEqual({ name: 'b' });
  });

  test('flush clears queue after run', async () => {
    const b = createBatchManager(makeRouter());
    b.add('/a');
    await b.flush();
    expect(b.size()).toBe(0);
  });

  test('flush returns empty array when queue is empty', async () => {
    const b = createBatchManager(makeRouter());
    const results = await b.flush();
    expect(results).toEqual([]);
  });

  test('records error and continues by default', async () => {
    const router = makeRouter({ '/bad': new Error('not found') });
    const b = createBatchManager(router);
    b.add('/bad').add('/ok');
    const results = await b.flush();
    expect(results[0].error).toBeInstanceOf(Error);
    expect(results[1].error).toBeNull();
  });

  test('stopOnError halts after first failure', async () => {
    const router = makeRouter({ '/bad': new Error('fail') });
    const b = createBatchManager(router);
    b.add('/bad', { stopOnError: true }).add('/ok');
    const results = await b.flush();
    expect(results).toHaveLength(1);
  });

  test('isFlushing is false when idle', () => {
    const b = createBatchManager(makeRouter());
    expect(b.isFlushing()).toBe(false);
  });
});
