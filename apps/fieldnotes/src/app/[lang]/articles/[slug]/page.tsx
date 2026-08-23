import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

import {
  dict,
  formatDate,
  getAllArticleSlugs,
  getArticleBySlug,
  getSiteByKey,
  imageUrl,
  isLang,
  LANGS,
} from '@blog/contentful';
import { ContentfulImage, RichText } from '@blog/contentful/components';

import { SITE_KEY } from '@/site';

type Params = { lang: string; slug: string };

/**
 * Every language x slug pair for this site only. The other app generates its
 * own, from its own site key.
 */
export async function generateStaticParams() {
  const slugs = await getAllArticleSlugs(SITE_KEY);
  return slugs.flatMap((slug) => LANGS.map((lang) => ({ lang, slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLang(lang)) return {};

  const site = await getSiteByKey(SITE_KEY, lang);
  if (!site) return {};

  const article = await getArticleBySlug(site.sys.id, slug, lang);
  if (!article) return {};

  // The seo entry is a component type: optional, and localized like everything else.
  const seo = article.fields.seo;
  const title = seo?.fields.metaTitle ?? article.fields.title;
  const description = seo?.fields.metaDescription ?? article.fields.excerpt;
  const ogImage = imageUrl(seo?.fields.ogImage ?? article.fields.heroImage, {
    width: 1200,
    height: 630,
    fit: 'fill',
    format: 'jpg',
  });

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime: article.fields.publishedDate,
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630 }] : undefined,
    },
    alternates: {
      languages: Object.fromEntries(LANGS.map((l) => [l, `/${l}/articles/${slug}`])),
    },
  };
}

export default async function ArticlePage({ params }: { params: Promise<Params> }) {
  const { lang, slug } = await params;
  if (!isLang(lang)) notFound();

  const site = await getSiteByKey(SITE_KEY, lang);
  if (!site) notFound();

  // Scoped to this site, so a slug belonging to the other app 404s here.
  const article = await getArticleBySlug(site.sys.id, slug, lang);
  if (!article) notFound();

  const t = dict(lang);
  const { title, body, heroImage, author, categories, publishedDate } = article.fields;

  return (
    <article>
      <Link
        href={`/${lang}/articles`}
        className="text-sm text-neutral-500 hover:text-[color:var(--accent)] dark:text-neutral-400"
      >
        {t.backToArticles}
      </Link>

      <h1 className="mt-4 text-4xl font-semibold tracking-tight text-balance">{title}</h1>

      <p className="mt-3 text-sm text-neutral-500 dark:text-neutral-400">
        {author ? `${t.by} ${author.fields.name} · ` : null}
        {t.publishedOn} <time dateTime={publishedDate}>{formatDate(publishedDate, lang)}</time>
      </p>

      {categories.length ? (
        <ul className="mt-3 flex flex-wrap gap-2">
          {categories.map((category) =>
            category ? (
              <li
                key={category.sys.id}
                className="rounded-full border border-neutral-300 px-2 py-0.5 text-xs text-neutral-600 dark:border-neutral-700 dark:text-neutral-400"
              >
                {category.fields.title}
              </li>
            ) : null,
          )}
        </ul>
      ) : null}

      <ContentfulImage
        asset={heroImage}
        aspect={{ width: 1200, height: 600 }}
        sizes="(max-width: 768px) 100vw, 768px"
        // The hero is the LCP element on this page, so it loads eagerly.
        priority
        className="mt-8 w-full rounded object-cover"
      />

      <div className="mt-8 text-[17px]">
        <RichText document={body} />
      </div>

      {author?.fields.bio ? (
        <aside className="mt-14 border-t border-neutral-200 pt-6 dark:border-neutral-800">
          <h2 className="text-sm font-semibold tracking-wide uppercase text-neutral-500 dark:text-neutral-400">
            {t.by} {author.fields.name}
          </h2>
          <div className="mt-2 text-neutral-700 dark:text-neutral-300">
            <RichText document={author.fields.bio} />
          </div>
        </aside>
      ) : null}
    </article>
  );
}
