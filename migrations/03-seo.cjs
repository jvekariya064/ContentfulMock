/**
 * Creates the `seo` content type.
 *
 * This is a "component" type: it is never routed to on its own, it only ever
 * exists as a reference on something else (here, `blogPost`). Splitting SEO out
 * instead of flattening the fields onto blogPost means the same shape can be
 * reused by any future page type.
 */
module.exports = function (migration) {
  const seo = migration
    .createContentType('seo')
    .name('SEO Metadata')
    .description('Search-engine and social-sharing metadata. Referenced by other types.')
    .displayField('metaTitle');

  seo
    .createField('metaTitle')
    .name('Meta Title')
    .type('Symbol')
    .required(true)
    .validations([{ size: { max: 60 }, message: 'Keep under 60 characters so it is not truncated in search results.' }]);

  seo
    .createField('metaDescription')
    .name('Meta Description')
    .type('Text')
    .validations([{ size: { max: 160 }, message: 'Keep under 160 characters so it is not truncated in search results.' }]);

  seo
    .createField('ogImage')
    .name('Social Share Image')
    .type('Link')
    .linkType('Asset')
    .validations([{ linkMimetypeGroup: ['image'] }]);

  seo.changeFieldControl('metaDescription', 'builtin', 'multipleLine', {
    helpText: 'Shown under the title in search results.',
  });
};
