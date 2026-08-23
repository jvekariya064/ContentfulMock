#!/usr/bin/env node
/**
 * Registers content preview environments in Contentful, so editors get working
 * "Open preview" buttons inside the entry editor.
 *
 *   npm run preview:setup
 *   npm run preview:setup https://meridian.example.com https://fieldnotes.example.com
 *
 * One preview environment per app, because the two apps run on different
 * origins. Contentful shows both buttons on every article; opening an article
 * in the wrong app returns a 404 that names the right one, rather than silently
 * rendering the other site's content.
 *
 * Contentful interpolates `{entry_id}` and `{locale}` when the button is
 * clicked. Deliberately not `{entry_field.slug}` — a preview URL cannot follow
 * the `site` reference, so each app resolves the article from its id and checks
 * it owns it.
 *
 * There is no plain-client method for preview environments, so this calls the
 * management API directly.
 */
import { loadEnv, requireEnv } from './lib/env.mjs';

loadEnv();
const [spaceId, token, secret] = requireEnv(
  'CONTENTFUL_SPACE_ID',
  'CONTENTFUL_MANAGEMENT_TOKEN',
  'CONTENTFUL_PREVIEW_SECRET',
);

const apps = [
  { key: 'meridian', label: 'Meridian', origin: process.argv[2] || 'http://localhost:3000' },
  { key: 'fieldnotes', label: 'Fieldnotes', origin: process.argv[3] || 'http://localhost:3001' },
];

const api = async (path, init = {}) => {
  const res = await fetch(`https://api.contentful.com/spaces/${spaceId}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/vnd.contentful.management.v1+json',
      ...init.headers,
    },
  });
  const body = res.status === 204 ? null : await res.json();
  if (!res.ok) throw new Error(`${res.status} ${JSON.stringify(body?.message ?? body)}`);
  return body;
};

const existing = await api('/preview_environments');

for (const app of apps) {
  const name = `${app.label} (Next.js)`;
  const origin = app.origin.replace(/\/$/, '');
  const url = `${origin}/api/preview?secret=${secret}&id={entry_id}&locale={locale}`;

  const payload = {
    name,
    description: `Opens the article in the ${app.label} app with draft mode enabled.`,
    configurations: [{ contentType: 'article', url, enabled: true, example: false }],
  };

  const match = existing.items.find((item) => item.name === name);

  const saved = match
    ? await api(`/preview_environments/${match.sys.id}`, {
        method: 'PUT',
        headers: { 'X-Contentful-Version': String(match.sys.version) },
        body: JSON.stringify(payload),
      })
    : await api('/preview_environments', { method: 'POST', body: JSON.stringify(payload) });

  console.log(`${match ? 'Updated' : 'Created'} "${saved.name}"`);
  console.log(`  ${url.replace(secret, '<secret>')}`);
}

// The single-app preview environment from before the split would now point at a
// port serving only one of the two sites.
const stale = existing.items.find((item) => item.name === 'Next.js preview');
if (stale) {
  await api(`/preview_environments/${stale.sys.id}`, {
    method: 'DELETE',
    headers: { 'X-Contentful-Version': String(stale.sys.version) },
  });
  console.log('\nRemoved the old single-app preview environment.');
}

console.log('\nCheck Settings → Content preview in the web app.');
