/**
 * TypeScript mirrors of the content types created by `migrations/`.
 *
 * These are hand-maintained: if you add a field in a migration, add it here too.
 * A "skeleton" describes the shape of an entry's fields plus its content type
 * id; the SDK combines it with a chain modifier to produce the actual `Entry`
 * type you get back from a query.
 *
 * Localization does not appear here. The Delivery API collapses a query to one
 * locale, so `fields.title` is a string whichever locale you asked for.
 */
import type { Entry, EntryFieldTypes, EntrySkeletonType } from 'contentful';

/**
 * We query with `withoutUnresolvableLinks`, so a reference is either the
 * resolved entry or `undefined` (when the linked entry is unpublished or
 * outside the `include` depth) — never a raw `{ sys: { type: 'Link' } }` stub.
 * Encoding that here means TypeScript forces you to null-check references.
 */
type Modifiers = 'WITHOUT_UNRESOLVABLE_LINKS';

export type SiteSkeleton = EntrySkeletonType<
  {
    name: EntryFieldTypes.Symbol;
    key: EntryFieldTypes.Symbol;
    tagline?: EntryFieldTypes.Symbol;
    locales: EntryFieldTypes.Array<EntryFieldTypes.Symbol>;
    defaultLocale: EntryFieldTypes.Symbol;
  },
  'site'
>;

export type AuthorSkeleton = EntrySkeletonType<
  {
    name: EntryFieldTypes.Symbol;
    slug: EntryFieldTypes.Symbol;
    bio?: EntryFieldTypes.RichText;
    avatar?: EntryFieldTypes.AssetLink;
  },
  'author'
>;

export type CategorySkeleton = EntrySkeletonType<
  {
    title: EntryFieldTypes.Symbol;
    slug: EntryFieldTypes.Symbol;
    description?: EntryFieldTypes.Text;
  },
  'category'
>;

export type SeoSkeleton = EntrySkeletonType<
  {
    metaTitle: EntryFieldTypes.Symbol;
    metaDescription?: EntryFieldTypes.Text;
    ogImage?: EntryFieldTypes.AssetLink;
  },
  'seo'
>;

export type ArticleSkeleton = EntrySkeletonType<
  {
    site: EntryFieldTypes.EntryLink<SiteSkeleton>;
    title: EntryFieldTypes.Symbol;
    slug: EntryFieldTypes.Symbol;
    excerpt: EntryFieldTypes.Text;
    body: EntryFieldTypes.RichText;
    heroImage: EntryFieldTypes.AssetLink;
    author: EntryFieldTypes.EntryLink<AuthorSkeleton>;
    categories: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<CategorySkeleton>>;
    publishedDate: EntryFieldTypes.Date;
    seo?: EntryFieldTypes.EntryLink<SeoSkeleton>;
  },
  'article'
>;

export type Site = Entry<SiteSkeleton, Modifiers, string>;
export type Author = Entry<AuthorSkeleton, Modifiers, string>;
export type Category = Entry<CategorySkeleton, Modifiers, string>;
export type Seo = Entry<SeoSkeleton, Modifiers, string>;
export type Article = Entry<ArticleSkeleton, Modifiers, string>;
