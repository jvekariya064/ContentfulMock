/**
 * Creates the `site` content type.
 *
 * Both sites live in one space and share authors, categories and assets. What
 * separates them is a required reference on `article` (07) — so "the articles
 * for this site" is a filter, not a different space.
 *
 * `key` is the URL segment. It is deliberately NOT localized: a site's identity
 * should not change between languages, or /acme/en and /ایکمی/ur would be
 * different sites as far as routing is concerned.
 */
module.exports = function (migration) {
  const site = migration
    .createContentType('site')
    .name('Site')
    .description('One of the sites served from this space.')
    .displayField('name');

  site.createField('name').name('Name').type('Symbol').required(true).localized(true);

  site
    .createField('key')
    .name('URL Key')
    .type('Symbol')
    .required(true)
    .validations([
      { unique: true },
      {
        regexp: { pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$' },
        message: 'Lowercase letters, numbers and hyphens only — this becomes the URL segment.',
      },
    ]);

  site.createField('tagline').name('Tagline').type('Symbol').localized(true);

  site
    .createField('locales')
    .name('Enabled Locales')
    .type('Array')
    .required(true)
    .items({ type: 'Symbol', validations: [{ in: ['en-US', 'ur'] }] })
    .validations([{ size: { min: 1 } }]);

  site
    .createField('defaultLocale')
    .name('Default Locale')
    .type('Symbol')
    .required(true)
    .validations([{ in: ['en-US', 'ur'] }]);

  site.changeFieldControl('key', 'builtin', 'slugEditor', { trackingFieldId: 'name' });
  site.changeFieldControl('locales', 'builtin', 'checkbox', {
    helpText: 'Which languages this site publishes in.',
  });
  site.changeFieldControl('defaultLocale', 'builtin', 'dropdown', {
    helpText: 'Used when no language is specified in the URL.',
  });
};
