#!/usr/bin/env node
/**
 * Populates the space with sample content: assets, sites, categories, authors,
 * SEO entries and articles, in both locales, all published.
 *
 *   npm run seed
 *
 * Safe to re-run. Every record has an explicit id, so a second run updates the
 * same entries rather than creating duplicates. Assets already carrying a
 * processed file are left alone instead of being re-uploaded.
 */
import { createClient } from 'contentful-management';
import { loadEnv, requireEnv } from './lib/env.mjs';
import { DEFAULT_LOCALE, toLocaleMap } from './lib/i18n.mjs';
import { articles, assets, authors, categories, drafts, sites } from './lib/seed-data.mjs';

loadEnv();
const [spaceId, accessToken] = requireEnv('CONTENTFUL_SPACE_ID', 'CONTENTFUL_MANAGEMENT_TOKEN');
const environmentId = process.env.CONTENTFUL_ENVIRONMENT_ID || 'master';

const client = createClient({ accessToken }, { type: 'plain', defaults: { spaceId, environmentId } });

/**
 * Expands seed fields into Contentful's locale-map format. Values wrapped in
 * `i18n()` carry their own per-locale map; everything else is stored against
 * the default locale only, and the `ur` fallback fills the gap at read time.
 */
const localized = (fields) =>
  Object.fromEntries(
    Object.entries(fields)
      .filter(([, value]) => value !== undefined)
      .map(([key, value]) => [key, toLocaleMap(value)]),
  );

const linkTo = (linkType, id) => ({ sys: { type: 'Link', linkType, id } });

function statusOf(error) {
  if (error?.name === 'NotFound') return 404;
  try {
    return JSON.parse(error.message).status ?? null;
  } catch {
    return error?.status ?? null;
  }
}

async function getOrNull(get) {
  try {
    return await get();
  } catch (error) {
    if (statusOf(error) === 404) return null;
    throw error;
  }
}

async function upsertAsset({ id, title, description, source }) {
  const existing = await getOrNull(() => client.asset.get({ assetId: id }));

  // Re-uploading is slow and the bytes never change, so skip anything already processed.
  if (existing?.fields?.file?.[DEFAULT_LOCALE]?.url) {
    if (!existing.sys.publishedVersion) {
      await client.asset.publish({ assetId: id }, existing);
      return 'published';
    }
    return 'skipped';
  }

  const fields = localized({
    title,
    description,
    file: { contentType: 'image/jpeg', fileName: `${id}.jpg`, upload: source },
  });

  const draft = existing
    ? await client.asset.update({ assetId: id }, { ...existing, fields })
    : await client.asset.createWithId({ assetId: id }, { fields });

  const processed = await client.asset.processForAllLocales({}, draft, {
    processingCheckWait: 2000,
    processingCheckRetries: 20,
  });

  await client.asset.publish({ assetId: id }, processed);
  return 'created';
}

async function upsertEntry(contentTypeId, id, fields, { publish = true } = {}) {
  const payload = localized(fields);
  const existing = await getOrNull(() => client.entry.get({ entryId: id }));

  const entry = existing
    ? await client.entry.update({ entryId: id }, { ...existing, fields: payload })
    : await client.entry.createWithId({ entryId: id, contentTypeId }, { fields: payload });

  if (publish) {
    await client.entry.publish({ entryId: id }, entry);
  } else if (entry.sys.publishedVersion) {
    // Left over from an earlier run that published it — put it back to draft.
    await client.entry.unpublish({ entryId: id });
  }

  return existing ? 'updated' : 'created';
}

function tally(results) {
  return Object.entries(results.reduce((acc, r) => ({ ...acc, [r]: (acc[r] ?? 0) + 1 }), {}))
    .map(([k, v]) => `${v} ${k}`)
    .join(', ');
}

async function step(label, records, run) {
  process.stdout.write(`${label.padEnd(12)}(${records.length}) ... `);
  const results = [];
  for (const record of records) results.push(await run(record));
  console.log(tally(results));
}

console.log(`Space ${spaceId} / environment ${environmentId}\n`);

// Assets first: entries reference them, and a reference to an unpublished asset
// would publish fine but render as a hole.
await step('assets', assets, upsertAsset);

await step('sites', sites, ({ id, ...fields }) => upsertEntry('site', id, fields));

await step('categories', categories, ({ id, ...fields }) => upsertEntry('category', id, fields));

await step('authors', authors, ({ id, avatar, ...fields }) =>
  upsertEntry('author', id, { ...fields, avatar: linkTo('Asset', avatar) }),
);

await step('seo', articles, (article) => {
  const { ogImage, ...seo } = article.seo;
  return upsertEntry('seo', `seo-${article.id}`, { ...seo, ogImage: linkTo('Asset', ogImage) });
});

await step('articles', articles, (article) =>
  upsertEntry('article', article.id, {
    site: linkTo('Entry', article.site),
    title: article.title,
    slug: article.slug,
    excerpt: article.excerpt,
    body: article.body,
    heroImage: linkTo('Asset', article.heroImage),
    author: linkTo('Entry', article.author),
    categories: article.categories.map((c) => linkTo('Entry', c)),
    publishedDate: article.publishedDate,
    seo: linkTo('Entry', `seo-${article.id}`),
  }),
);

// Deliberately left unpublished, so preview mode has something to prove.
await step('drafts', drafts, (article) =>
  upsertEntry(
    'article',
    article.id,
    {
      site: linkTo('Entry', article.site),
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt,
      body: article.body,
      heroImage: linkTo('Asset', article.heroImage),
      author: linkTo('Entry', article.author),
      categories: article.categories.map((c) => linkTo('Entry', c)),
      publishedDate: article.publishedDate,
    },
    { publish: false },
  ),
);

console.log('\nDone.');
