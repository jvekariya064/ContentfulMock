/**
 * Locale helpers for the seed.
 *
 * Contentful stores every field as a locale map internally, even in a
 * single-locale space:
 *
 *   "title": { "en-US": "…", "ur": "…" }
 *
 * The seed data is easier to read if non-translated fields are written as plain
 * values, so `i18n()` tags the ones that really do differ per locale and
 * `seed.mjs` expands everything else into the default locale.
 */

export const DEFAULT_LOCALE = 'en-US';
export const LOCALES = ['en-US', 'ur'];

/** Right-to-left locales, used by the app to set `dir`. */
export const RTL_LOCALES = new Set(['ur']);

const TAG = Symbol.for('contentful-seed.localized');

/** Marks a field as having a distinct value per locale. */
export const i18n = (values) => ({ [TAG]: true, values });

export const isLocalized = (value) => Boolean(value && value[TAG]);

/** Expands a seed field into Contentful's locale-map format. */
export function toLocaleMap(value) {
  return isLocalized(value) ? value.values : { [DEFAULT_LOCALE]: value };
}
