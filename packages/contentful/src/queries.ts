import 'server-only';

import { draftMode } from 'next/headers';

import { getClient } from './client';
import { localeOf, type Lang } from './i18n';
import type { Article, ArticleSkeleton, Site, SiteSkeleton } from './types';

/**
 * All Contentful reads live here rather than in components, so there is exactly
 * one place where the preview decision is made and one place where `locale` is
 * threaded through.
 *
 * Every article query is scoped to a site. Both apps read the same space, and
 * the `site` reference is what separates them — an app that forgot to filter
 * would render the other app's articles.
 */

/**
 * Draft mode is a Next.js cookie, set by the /api/preview route. Reading it here
 * means no page can forget to, and no page can opt into preview by accident.
 */
async function client() {
  const { isEnabled } = await draftMode();
  return getClient(isEnabled);
}

export async function getSiteByKey(key: string, lang: Lang): Promise<Site | null> {
  const res = await (await client()).getEntries<SiteSkeleton>({
    content_type: 'site',
    'fields.key': key,
    locale: localeOf(lang),
    limit: 1,
  });
  return res.items[0] ?? null;
}

export async function getArticles(siteId: string, lang: Lang): Promise<Article[]> {
  const res = await (await client()).getEntries<ArticleSkeleton>({
    content_type: 'article',
    'fields.site.sys.id': siteId,
    locale: localeOf(lang),
    order: ['-fields.publishedDate'],
    include: 2,
  });
  return res.items;
}

export async function getArticleBySlug(
  siteId: string,
  slug: string,
  lang: Lang,
): Promise<Article | null> {
  const res = await (await client()).getEntries<ArticleSkeleton>({
    content_type: 'article',
    'fields.site.sys.id': siteId,
    'fields.slug': slug,
    locale: localeOf(lang),
    limit: 1,
    include: 2,
  });
  return res.items[0] ?? null;
}

/**
 * Looks an article up by entry id — the only thing Contentful's preview URLs
 * can reliably interpolate, since a preview URL token cannot follow the `site`
 * reference. The caller is responsible for checking the article belongs to it.
 */
export async function getArticleById(entryId: string, lang: Lang): Promise<Article | null> {
  const res = await (await client()).getEntries<ArticleSkeleton>({
    content_type: 'article',
    'sys.id': entryId,
    locale: localeOf(lang),
    limit: 1,
    include: 2,
  });
  return res.items[0] ?? null;
}

/**
 * Slugs for one site, for generateStaticParams. Uses the delivery client
 * directly — build-time params should never come from draft content.
 */
export async function getAllArticleSlugs(siteKey: string): Promise<string[]> {
  const delivery = getClient();

  const sites = await delivery.getEntries<SiteSkeleton>({
    content_type: 'site',
    'fields.key': siteKey,
    limit: 1,
  });
  const site = sites.items[0];
  if (!site) return [];

  const res = await delivery.getEntries<ArticleSkeleton>({
    content_type: 'article',
    'fields.site.sys.id': site.sys.id,
    include: 0,
    limit: 1000,
  });

  return res.items.map((article) => article.fields.slug);
}
