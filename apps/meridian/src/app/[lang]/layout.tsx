import { draftMode } from 'next/headers';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

import { getSiteByKey, dirOf, htmlLangOf, isLang, LANGS } from '@blog/contentful';
import { PreviewBanner, SiteHeader } from '@blog/contentful/components';

import '../globals.css';
import { SITE_KEY } from '@/site';

/**
 * The root layout, even though it sits under a dynamic segment.
 *
 * That is deliberate: `dir="rtl"` and `lang="ur"` belong on <html>, and a layout
 * at src/app/layout.tsx cannot see route params. Requests to "/" never reach a
 * layout — src/proxy.ts redirects them first.
 */

type Params = { lang: string };

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};

  const site = await getSiteByKey(SITE_KEY, lang);
  if (!site) return {};

  return {
    title: { default: site.fields.name, template: `%s · ${site.fields.name}` },
    description: site.fields.tagline,
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<Params>;
}) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();

  const [site, { isEnabled: isPreview }] = await Promise.all([
    getSiteByKey(SITE_KEY, lang),
    draftMode(),
  ]);

  // If this fails, the space is missing the site entry this app is named for.
  if (!site) notFound();

  // A site declares which languages it publishes in.
  if (!site.fields.locales.includes(lang === 'ur' ? 'ur' : 'en-US')) notFound();

  return (
    <html lang={htmlLangOf(lang)} dir={dirOf(lang)}>
      <body className="min-h-screen antialiased">
        {isPreview ? <PreviewBanner lang={lang} path={`/${lang}/articles`} /> : null}
        <SiteHeader site={site} lang={lang} />
        <main className="mx-auto max-w-3xl px-6 py-10">{children}</main>
      </body>
    </html>
  );
}
