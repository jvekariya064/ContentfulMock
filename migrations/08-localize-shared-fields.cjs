/**
 * Marks translatable fields on the shared types as localized.
 *
 * `author`, `category` and `seo` were created (01–03) before the space had a
 * second locale, so every field was single-value. Turning `localized` on tells
 * Contentful to store one value per locale.
 *
 * Note what is NOT localized:
 *   - slugs and keys — URLs stay stable across languages
 *   - author name — a person's name is the same in both
 *   - asset references — the same image serves both languages
 *
 * `editField` merges, so restating only `localized` leaves the existing
 * validations intact.
 */
module.exports = function (migration) {
  migration.editContentType('author').editField('bio').localized(true);

  const category = migration.editContentType('category');
  category.editField('title').localized(true);
  category.editField('description').localized(true);

  const seo = migration.editContentType('seo');
  seo.editField('metaTitle').localized(true);
  seo.editField('metaDescription').localized(true);
};
