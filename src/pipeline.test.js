import { createPipeline } from './pipeline.js';

test('runs stages in order', async () => {
  const p = createPipeline();
  const order = [];
  p.add('a', () => { order.push('a'); });
  p.add('b', () => { order.push('b'); });
  const res = await p.run({});
  expect(res.ok).toBe(true);
  expect(order).toEqual(['a', 'b']);
});

test('aborts when stage returns false', async () => {
  const p = createPipeline();
  const called = [];
  p.add('a', () => { called.push('a'); return false; });
  p.add('b', () => { called.push('b'); });
  const res = await p.run({});
  expect(res.ok).toBe(false);
  expect(res.aborted).toBe(true);
  expect(res.stage).toBe('a');
  expect(called).toEqual(['a']);
});

test('merges returned objects into context', async () => {
  const p = createPipeline();
  p.add('enrich', () => ({ user: 'alice' }));
  const ctx = {};
  const res = await p.run(ctx);
  expect(res.ok).toBe(true);
  expect(res.context.user).toBe('alice');
});

test('catches errors and returns ok false', async () => {
  const p = createPipeline();
  p.add('boom', () => { throw new Error('oops'); });
  const res = await p.run({});
  expect(res.ok).toBe(false);
  expect(res.error.message).toBe('oops');
  expect(res.stage).toBe('boom');
});

test('remove drops a stage', async () => {
  const p = createPipeline();
  p.add('a', () => {}).add('b', () => {});
  p.remove('a');
  expect(p.list()).toEqual(['b']);
  expect(p.size()).toBe(1);
});

test('has returns correct boolean', () => {
  const p = createPipeline();
  p.add('x', () => {});
  expect(p.has('x')).toBe(true);
  expect(p.has('y')).toBe(false);
});

test('clear removes all stages', () => {
  const p = createPipeline();
  p.add('a', () => {}).add('b', () => {});
  p.clear();
  expect(p.size()).toBe(0);
});

test('throws if stage is not a function', () => {
  const p = createPipeline();
  expect(() => p.add('bad', 'nope')).toThrow();
});
