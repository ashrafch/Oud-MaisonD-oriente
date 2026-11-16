import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readJsonBody } from '../src/lib/security/json-body.ts';
import { validateImageBytes } from '../src/lib/security/image-validation.ts';
import { categorySchema, marketingSchema, contentSchema } from '../src/lib/validations/admin.ts';

test('chunked JSON stops at the actual byte limit without trusting Content-Length', async () => {
  let canceled = false;
  const stream = new ReadableStream({
    pull(controller) { controller.enqueue(new Uint8Array(70000)); },
    cancel() { canceled = true; }
  });
  const request = new Request('https://example.org', { method: 'POST', body: stream, duplex: 'half' });
  assert.equal(await readJsonBody(request), null);
  assert.equal(canceled, true);
  assert.deepEqual(await readJsonBody(new Request('https://example.org', { method: 'POST', body: '{"valid":true}' })), { valid: true });
});

test('image type must match file signature and reject executable text', () => {
  assert.equal(validateImageBytes(new TextEncoder().encode('<script>alert(1)</script>'), 'image/png'), false);
  assert.equal(validateImageBytes(new Uint8Array([255,216,255]), 'image/jpeg'), true);
  assert.equal(validateImageBytes(new Uint8Array([255,216,255]), 'image/png'), false);
});

test('admin inputs reject unsafe slugs, arbitrary content keys and incomplete schedules', () => {
  const category = { name: 'Oud', slug: 'oud', description: '', isVisible: true, sortOrder: 0 };
  assert.equal(categorySchema.safeParse(category).success, true);
  assert.equal(categorySchema.safeParse({ ...category, slug: '../settings' }).success, false);
  assert.equal(contentSchema.safeParse({ slug: 'admin', title: 'Test', body: '' }).success, false);
  assert.equal(marketingSchema.safeParse({ channel: 'Instagram', caption: 'Test', hashtags: [], status: 'scheduled' }).success, false);
});
