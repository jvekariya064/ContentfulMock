import 'server-only';

import { createClient } from 'contentful';

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing ${name}. Copy .env.example to .env.local and fill it in.`);
  }
  return value;
}

const space = required('CONTENTFUL_SPACE_ID');
const environment = process.env.CONTENTFUL_ENVIRONMENT_ID || 'master';

/** Published content only. This is what production pages read from. */
const deliveryClient = createClient({
  space,
  environment,
  accessToken: required('CONTENTFUL_DELIVERY_TOKEN'),
});

/**
 * Draft + published content. Served from a different host, which is why it
 * needs its own client rather than just a different token.
 */
const previewClient = createClient({
  space,
  environment,
  accessToken: required('CONTENTFUL_PREVIEW_TOKEN'),
  host: 'preview.contentful.com',
});

/**
 * `withoutUnresolvableLinks` turns links the API could not resolve into
 * `undefined` instead of leaving a `{ sys: { type: 'Link' } }` stub in place —
 * so a reference to an unpublished entry does not blow up at render time.
 */
export function getClient(preview = false) {
  return (preview ? previewClient : deliveryClient).withoutUnresolvableLinks;
}
