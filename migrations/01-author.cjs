/**
 * Creates the `author` content type.
 *
 * Run order matters: this has no references to other types, so it goes first.
 */
module.exports = function (migration) {
  const author = migration
    .createContentType('author')
    .name('Author')
    .description('A person who writes blog posts.')
    .displayField('name');

  author
    .createField('name')
    .name('Name')
    .type('Symbol')
    .required(true);

  author
    .createField('slug')
    .name('Slug')
    .type('Symbol')
    .required(true)
    .validations([
      { unique: true },
      {
        regexp: { pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$' },
        message: 'Lowercase letters, numbers and hyphens only (e.g. "ada-lovelace").',
      },
    ]);

  author
    .createField('bio')
    .name('Bio')
    .type('RichText')
    .validations([
      {
        enabledNodeTypes: ['hyperlink', 'ordered-list', 'unordered-list'],
        message: 'Bios support links and simple lists only.',
      },
      { enabledMarks: ['bold', 'italic', 'code'] },
    ]);

  author
    .createField('avatar')
    .name('Avatar')
    .type('Link')
    .linkType('Asset')
    .validations([{ linkMimetypeGroup: ['image'] }]);

  // Auto-fills the slug from the name in the Contentful web UI.
  author.changeFieldControl('slug', 'builtin', 'slugEditor', {
    trackingFieldId: 'name',
  });
};
