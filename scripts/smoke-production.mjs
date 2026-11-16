import assert from 'node:assert/strict';

const base = new URL(process.env.SMOKE_BASE_URL || 'https://oud-maison-d-oriente.vercel.app');
assert.equal(base.protocol, 'https:');
for (const path of ['/', '/products', '/admin/login', '/api/health']) {
  const response = await fetch(new URL(path, base), { signal: AbortSignal.timeout(20000) });
  assert.equal(response.status, 200, `${path}: HTTP ${response.status}`);
  assert.equal(response.headers.get('x-frame-options'), 'DENY', `${path}: missing frame protection`);
  if (path === '/api/health') assert.equal((await response.json()).status, 'ok');
}
for (const path of ['products', 'orders', 'inventory', 'coupons', 'categories', 'collections', 'content', 'marketing']) {
  const response = await fetch(new URL(`/api/admin/${path}`, base), { signal: AbortSignal.timeout(20000) });
  assert.equal(response.status, 401, `${path}: admin access must be denied`);
  assert.match((await response.json()).error, /Accesso admin/);
}
console.log('PASS storefront, database health, security headers and admin access checks');
