#!/usr/bin/env node
/**
 * Deletes every entry of a content type, so the type itself can be dropped.
 *
 *   npm run prune blogPost
 *
 * Contentful refuses to delete a content type that still has entries, and
 * deleting an entry is two steps: unpublish (remove from the Delivery API),
 * then delete (remove entirely).
 *
 * Destructive and not reversible. It takes the content type id as an explicit
 * argument and never defaults to one.
 */
import { createClient } from 'contentful-management';
import { loadEnv, requireEnv } from './lib/env.mjs';

loadEnv();
const [spaceId, accessToken] = requireEnv('CONTENTFUL_SPACE_ID', 'CONTENTFUL_MANAGEMENT_TOKEN');
const environmentId = process.env.CONTENTFUL_ENVIRONMENT_ID || 'master';

const contentType = process.argv[2];
if (!contentType) {
  console.error('Usage: npm run prune <contentTypeId>\nRefusing to run without an explicit content type.');
  process.exit(1);
}

const client = createClient({ accessToken }, { type: 'plain', defaults: { spaceId, environmentId } });

const { items } = await client.entry.getMany({ query: { content_type: contentType, limit: 1000 } });

if (!items.length) {
  console.log(`No ${contentType} entries. Nothing to do.`);
  process.exit(0);
}

console.log(`Deleting ${items.length} ${contentType} ${items.length === 1 ? 'entry' : 'entries'} from ${spaceId}/${environmentId}`);

for (const entry of items) {
  const entryId = entry.sys.id;
  if (entry.sys.publishedVersion) {
    await client.entry.unpublish({ entryId });
  }
  await client.entry.delete({ entryId });
  console.log(`  deleted ${entryId}`);
}

console.log('Done.');
