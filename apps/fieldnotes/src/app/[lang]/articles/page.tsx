import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

import { dict, getArticles, getSiteByKey, isLang } from '@blog/contentful';
import { ArticleCard } from '@blog/contentful/components';

import { SITE_KEY } from '@/site';

type Params = { lang: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { lang } = await params;
  return isLang(lang) ? { title: dict(lang).articles } : {};
}

export default async function ArticlesPage({ params }: { params: Promise<Params> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();

  const site = await getSiteByKey(SITE_KEY, lang);
  if (!site) notFound();

  const articles = await getArticles(site.sys.id, lang);
  const t = dict(lang);

  return (
    <>
      <h1 className="mb-8 text-3xl font-semibold tracking-tight text-balance">{t.articles}</h1>

      <div className="flex flex-col gap-8">
        {articles.map((article) => (
          <ArticleCard key={article.sys.id} article={article} lang={lang} />
        ))}
      </div>
    </>
  );
}
