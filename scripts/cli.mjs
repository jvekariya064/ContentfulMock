#!/usr/bin/env node
/**
 * Thin wrapper around `contentful-cli`, so the CLI can be driven from npm
 * scripts without pasting credentials on the command line.
 *
 *   npm run migrate:cli          # apply every migration through the CLI
 *   npm run migrate:cli 10-      # apply only migrations starting with "10-"
 *   npm run space:export         # dump the whole space to contentful-export.json
 *   npm run cf -- space list     # any other CLI command, credentials injected
 *
 * The filter argument matters: migrations are not idempotent, so running the
 * whole set against an already-migrated space fails on the first
 * `createContentType`. That is correct behaviour, but it means "run everything"
 * is only useful against a fresh environment.
 *
 * `npm run migrate` (scripts/migrate.mjs) does the same job programmatically and
 * is what you would use in CI. Both paths exist because they answer different
 * questions: the CLI is what Contentful documents and what a reviewer expects to
 * see, the programmatic runner is what actually scales — one command, shared env
 * loading, and a single place to add logging or a dry run.
 */
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { loadEnv, projectRoot, requireEnv } from './lib/env.mjs';

loadEnv();
const [spaceId, managementToken] = requireEnv(
  'CONTENTFUL_SPACE_ID',
  'CONTENTFUL_MANAGEMENT_TOKEN',
);
const environmentId = process.env.CONTENTFUL_ENVIRONMENT_ID || 'master';

const contentfulBin = path.join(projectRoot, 'node_modules', '.bin', 'contentful');

/**
 * contentful-cli reads no auth environment variable — it wants either
 * `contentful login` (which writes ~/.contentfulrc.json) or an explicit
 * --management-token on every subcommand. It does honour CONTENTFUL_CONFIG_FILE,
 * so we write a throwaway rc file instead: one mechanism that works for every
 * subcommand, without guessing which flags each one accepts.
 *
 * Written to the OS temp dir with owner-only permissions and deleted on exit,
 * so the token never lands in the repo.
 */
const rcPath = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'contentful-cli-')), 'rc.json');
fs.writeFileSync(
  rcPath,
  JSON.stringify({
    managementToken,
    activeSpaceId: spaceId,
    activeEnvironmentId: environmentId,
  }),
  { mode: 0o600 },
);

const cleanup = () => fs.rmSync(path.dirname(rcPath), { recursive: true, force: true });
process.on('exit', cleanup);
process.on('SIGINT', () => process.exit(130));

function run(args) {
  console.log(`\n$ contentful ${args.join(' ')}`);
  const result = spawnSync(contentfulBin, args, {
    stdio: 'inherit',
    env: { ...process.env, CONTENTFUL_CONFIG_FILE: rcPath },
  });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

const common = [
  '--space-id', spaceId,
  '--environment-id', environmentId,
  '--management-token', managementToken,
];

const command = process.argv[2];

if (command === 'migrate') {
  const only = process.argv[3];
  const dir = path.join(projectRoot, 'migrations');
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.cjs')).sort();
  const selected = only ? files.filter((f) => f === only || f.startsWith(only)) : files;

  if (!selected.length) {
    console.error(`No migration matching "${only}".\nAvailable:\n  ${files.join('\n  ')}`);
    process.exit(1);
  }

  for (const file of selected) {
    run(['space', 'migration', ...common, '--yes', path.join('migrations', file)]);
  }
} else if (command === 'raw') {
  // Passthrough for any contentful-cli command, with credentials from
  // .env.local so you never have to paste a token or run `contentful login`.
  const args = process.argv.slice(3);
  if (!args.length) {
    console.error('Usage: npm run cf -- <contentful cli args>\n  e.g. npm run cf -- space list');
    process.exit(1);
  }
  run(args);
} else if (command === 'export') {
  run([
    'space', 'export',
    '--space-id', spaceId,
    '--environment-id', environmentId,
    '--management-token', managementToken,
    '--content-file', 'contentful-export.json',
    '--download-assets', 'false',
    '--save-file', 'true',
    // Off by default, which silently drops the unpublished demo article and
    // makes the export a poor reproduction of the space.
    '--include-drafts', 'true',
  ]);
  console.log('\nWrote contentful-export.json — the whole model and content in one reviewable file.');
} else {
  console.error(
    'Usage:\n' +
      '  node scripts/cli.mjs migrate [filter]   apply migrations\n' +
      '  node scripts/cli.mjs export             dump the space to JSON\n' +
      '  node scripts/cli.mjs raw <args...>      any contentful-cli command',
  );
  process.exit(1);
}
