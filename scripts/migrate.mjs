#!/usr/bin/env node
/**
 * Runs the content-model migrations in `migrations/` against a Contentful
 * environment, in filename order.
 *
 *   npm run migrate                    # run every migration
 *   npm run migrate 04-blog-post.cjs   # run just one
 *
 * Migrations are NOT idempotent: `createContentType` fails if the type already
 * exists. That is deliberate — it is how Contentful keeps you from silently
 * clobbering a live model. To change an existing type, add a new numbered file
 * that alters it rather than editing an old one.
 */
import fs from 'node:fs';
import path from 'node:path';
import { runMigration } from 'contentful-migration';
import { loadEnv, projectRoot, requireEnv } from './lib/env.mjs';

loadEnv();
const [spaceId, accessToken] = requireEnv('CONTENTFUL_SPACE_ID', 'CONTENTFUL_MANAGEMENT_TOKEN');
const environmentId = process.env.CONTENTFUL_ENVIRONMENT_ID || 'master';

const dir = path.join(projectRoot, 'migrations');
const only = process.argv[2];
const files = fs
  .readdirSync(dir)
  .filter((f) => f.endsWith('.cjs'))
  .sort();

const selected = only ? files.filter((f) => f === only || f.startsWith(only)) : files;

if (!selected.length) {
  console.error(only ? `No migration matching "${only}".` : 'No migrations found.');
  process.exit(1);
}

console.log(`Space ${spaceId} / environment ${environmentId}\n`);

for (const file of selected) {
  console.log(`── ${file}`);
  await runMigration({
    filePath: path.join(dir, file),
    spaceId,
    environmentId,
    accessToken,
    yes: true, // skip the interactive "apply these changes?" prompt
  });
}

console.log('\nDone.');
