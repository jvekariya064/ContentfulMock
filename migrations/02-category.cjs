/**
 * Creates the `category` content type.
 */
module.exports = function (migration) {
  const category = migration
    .createContentType('category')
    .name('Category')
    .description('A topic grouping for blog posts.')
    .displayField('title');

  category
    .createField('title')
    .name('Title')
    .type('Symbol')
    .required(true)
    .validations([{ unique: true }]);

  category
    .createField('slug')
    .name('Slug')
    .type('Symbol')
    .required(true)
    .validations([
      { unique: true },
      {
        regexp: { pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$' },
        message: 'Lowercase letters, numbers and hyphens only (e.g. "web-performance").',
      },
    ]);

  category
    .createField('description')
    .name('Description')
    .type('Text')
    .validations([{ size: { max: 300 } }]);

  category.changeFieldControl('slug', 'builtin', 'slugEditor', {
    trackingFieldId: 'title',
  });
};
