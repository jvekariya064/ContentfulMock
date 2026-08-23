/**
 * Drops the old `blogPost` content type, superseded by `article` in 06.
 *
 * Contentful refuses to delete a content type that still has entries, so on a
 * space where blogPost was populated you must delete its entries first:
 *
 *   npm run prune blogPost
 *
 * On a fresh space this is a no-op — 04 creates blogPost, 06 creates article,
 * and this deletes blogPost before anything is ever written to it.
 */
module.exports = function (migration) {
  migration.deleteContentType('blogPost');
};
