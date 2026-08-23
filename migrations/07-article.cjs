/**
 * Creates the `article` content type — the renamed `blogPost`.
 *
 * A content type id is immutable once created, so renaming means creating the
 * new type and deleting the old one (09). This file is deliberately a near-copy
 * of 04 rather than a shared helper: a migration is a snapshot of intent at a
 * point in time, and refactoring old ones to share code makes history lie.
 *
 * Two things differ from 04 beyond the name:
 *   - `site` — a required reference, which is what separates the two sites
 *   - `localized` on the translatable fields
 *
 * `slug` is deliberately NOT localized. A localized slug gives you prettier
 * Urdu URLs at the cost of every route needing a per-locale lookup, and a
 * language switcher that cannot just swap the prefix. Stable slugs are the
 * cheaper trade here; revisit it if the client asks for native-script URLs.
 *
 * `categories` is required here from the start, which 04 + 05 arrived at in two
 * steps.
 */
module.exports = function (migration) {
  const article = migration
    .createContentType('article')
    .name('Article')
    .description('A single article, belonging to exactly one site.')
    .displayField('title');

  article
    .createField('site')
    .name('Site')
    .type('Link')
    .linkType('Entry')
    .required(true)
    .validations([{ linkContentType: ['site'] }]);

  article.createField('title').name('Title').type('Symbol').required(true).localized(true);

  article
    .createField('slug')
    .name('Slug')
    .type('Symbol')
    .required(true)
    .validations([
      { unique: true },
      {
        regexp: { pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$' },
        message: 'Lowercase letters, numbers and hyphens only (e.g. "hello-world").',
      },
    ]);

  article
    .createField('excerpt')
    .name('Excerpt')
    .type('Text')
    .required(true)
    .localized(true)
    .validations([{ size: { max: 300 } }]);

  article
    .createField('body')
    .name('Body')
    .type('RichText')
    .required(true)
    .localized(true)
    .validations([
      {
        enabledNodeTypes: [
          'heading-2',
          'heading-3',
          'heading-4',
          'ordered-list',
          'unordered-list',
          'blockquote',
          'hr',
          'table',
          'hyperlink',
          'entry-hyperlink',
          'asset-hyperlink',
          'embedded-asset-block',
          'embedded-entry-block',
          'embedded-entry-inline',
        ],
        message: 'Heading 1 is reserved for the article title.',
      },
      { enabledMarks: ['bold', 'italic', 'underline', 'code'] },
    ]);

  article
    .createField('heroImage')
    .name('Hero Image')
    .type('Link')
    .linkType('Asset')
    .required(true)
    .validations([{ linkMimetypeGroup: ['image'] }]);

  article
    .createField('author')
    .name('Author')
    .type('Link')
    .linkType('Entry')
    .required(true)
    .validations([{ linkContentType: ['author'] }]);

  article
    .createField('categories')
    .name('Categories')
    .type('Array')
    .required(true)
    .items({
      type: 'Link',
      linkType: 'Entry',
      validations: [{ linkContentType: ['category'] }],
    })
    .validations([
      { size: { min: 1, max: 3 }, message: 'Pick between one and three categories.' },
    ]);

  article.createField('publishedDate').name('Published Date').type('Date').required(true);

  article
    .createField('seo')
    .name('SEO')
    .type('Link')
    .linkType('Entry')
    .validations([{ linkContentType: ['seo'] }]);

  article.changeFieldControl('slug', 'builtin', 'slugEditor', { trackingFieldId: 'title' });
  article.changeFieldControl('publishedDate', 'builtin', 'datePicker', { format: 'dateonly' });
};
