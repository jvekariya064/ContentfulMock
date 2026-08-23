import Link from 'next/link';

import { ContentfulImage } from './ContentfulImage';
import type { Article } from '../types';
import { dict, formatDate, type Lang } from '../i18n';

export function ArticleCard({ article, lang }: { article: Article; lang: Lang }) {
  const t = dict(lang);
  const { title, slug, excerpt, heroImage, author, categories, publishedDate } = article.fields;
  const href = `/${lang}/articles/${slug}`;

  return (
    <article className="grid gap-5 border-b border-neutral-200 pb-8 sm:grid-cols-[200px_minmax(0,1fr)] dark:border-neutral-800">
      <Link href={href} tabIndex={-1} aria-hidden="true" className="block">
        <ContentfulImage
          asset={heroImage}
          aspect={{ width: 640, height: 360 }}
          sizes="(max-width: 640px) 100vw, 200px"
          className="aspect-video w-full rounded object-cover"
        />
      </Link>

      <div className="min-w-0">
        <h2 className="text-xl font-semibold tracking-tight text-balance">
          <Link href={href} className="hover:text-[color:var(--accent)]">
            {title}
          </Link>
        </h2>

        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          {author ? `${t.by} ${author.fields.name} · ` : null}
          <time dateTime={publishedDate}>{formatDate(publishedDate, lang)}</time>
        </p>

        <p className="mt-3 text-neutral-700 dark:text-neutral-300">{excerpt}</p>

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
      </div>
    </article>
  );
}
