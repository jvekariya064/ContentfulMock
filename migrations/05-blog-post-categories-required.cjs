/**
 * Makes `blogPost.categories` required.
 *
 * 04 gave the field a `size: { min: 1 }` validation, which only applies when the
 * field has a value — the field itself could still be omitted. That contradicted
 * `src/lib/contentful/types.ts`, which declares it non-optional.
 *
 * Note this is a separate file rather than an edit to 04: 04 has already run
 * against the space, and re-running it would fail on `createContentType`.
 */
module.exports = function (migration) {
  migration.editContentType('blogPost').editField('categories').required(true);
};
