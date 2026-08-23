/**
 * Creates the `blogPost` content type.
 *
 * Runs last because it references author, category and seo — Contentful
 * validates `linkContentType` against types that must already exist.
 */
module.exports = function (migration) {
  const post = migration
    .createContentType('blogPost')
    .name('Blog Post')
    .description('A single article.')
    .displayField('title');

  post
    .createField('title')
    .name('Title')
    .type('Symbol')
    .required(true);

  post
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

  post
    .createField('excerpt')
    .name('Excerpt')
    .type('Text')
    .required(true)
    .validations([{ size: { max: 300 } }]);

  post
    .createField('body')
    .name('Body')
    .type('RichText')
    .required(true)
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
        message: 'Heading 1 is reserved for the post title.',
      },
      { enabledMarks: ['bold', 'italic', 'underline', 'code'] },
    ]);

  post
    .createField('heroImage')
    .name('Hero Image')
    .type('Link')
    .linkType('Asset')
    .required(true)
    .validations([{ linkMimetypeGroup: ['image'] }]);

  post
    .createField('author')
    .name('Author')
    .type('Link')
    .linkType('Entry')
    .required(true)
    .validations([{ linkContentType: ['author'] }]);

  post
    .createField('categories')
    .name('Categories')
    .type('Array')
    .items({
      type: 'Link',
      linkType: 'Entry',
      validations: [{ linkContentType: ['category'] }],
    })
    .validations([{ size: { min: 1, max: 3 }, message: 'Pick between one and three categories.' }]);

  post
    .createField('publishedDate')
    .name('Published Date')
    .type('Date')
    .required(true);

  post
    .createField('seo')
    .name('SEO')
    .type('Link')
    .linkType('Entry')
    .validations([{ linkContentType: ['seo'] }]);

  post.changeFieldControl('slug', 'builtin', 'slugEditor', {
    trackingFieldId: 'title',
  });

  post.changeFieldControl('publishedDate', 'builtin', 'datePicker', {
    format: 'dateonly',
  });
};
