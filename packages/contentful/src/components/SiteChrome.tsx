import Link from 'next/link';

import type { Site } from '../types';
import { dict, otherLang, type Lang } from '../i18n';

/**
 * Header for a single site. There is no site switcher: the two sites are
 * separate applications on separate ports, so there is nothing to switch to
 * from inside one of them.
 *
 * `--accent` comes from each app's globals.css, which is how the two apps look
 * different while sharing every component.
 */
export function SiteHeader({ site, lang }: { site: Site; lang: Lang }) {
  const t = dict(lang);

  return (
    <header className="border-b border-neutral-200 dark:border-neutral-800">
      <div className="mx-auto flex max-w-3xl flex-wrap items-baseline justify-between gap-4 px-6 py-6">
        <div>
          <Link
            href={`/${lang}/articles`}
            className="text-lg font-semibold tracking-tight hover:text-[color:var(--accent)]"
          >
            {site.fields.name}
          </Link>
          {site.fields.tagline ? (
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
              {site.fields.tagline}
            </p>
          ) : null}
        </div>

        <nav className="flex items-center gap-4 text-sm">
          <Link
            href={`/${otherLang(lang)}/articles`}
            hrefLang={otherLang(lang)}
            className="rounded border border-neutral-300 px-2 py-1 hover:border-[color:var(--accent)] hover:text-[color:var(--accent)] dark:border-neutral-700"
          >
            {t.otherLanguage}
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function PreviewBanner({ lang, path }: { lang: Lang; path: string }) {
  const t = dict(lang);
  return (
    <div className="bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200">
      <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-3 px-6 py-2 text-sm">
        <span>{t.previewBanner}</span>
        <a
          href={`/api/preview/exit?redirect=${encodeURIComponent(path)}`}
          className="underline underline-offset-2"
        >
          {t.exitPreview}
        </a>
      </div>
    </div>
  );
}
