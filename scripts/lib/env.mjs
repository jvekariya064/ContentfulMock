import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

/** Minimal .env loader — avoids a dependency and never overwrites a real env var. */
export function loadEnv(file = path.join(projectRoot, '.env.local')) {
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, 'utf8').split('\n')) {
    if (line.trim().startsWith('#')) continue;
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (!match) continue;
    const key = match[1];
    let value = (match[2] ?? '').trim();
    if (/^(['"]).*\1$/.test(value)) value = value.slice(1, -1);
    if (value && process.env[key] === undefined) process.env[key] = value;
  }
}

/** Reads a required env var, or exits with a useful message. */
export function requireEnv(...names) {
  const missing = names.filter((n) => !process.env[n]);
  if (missing.length) {
    console.error(
      `Missing ${missing.join(' and ')}.\n` +
        'Copy .env.example to .env.local and fill it in, then re-run.',
    );
    process.exit(1);
  }
  return names.map((n) => process.env[n]);
}
