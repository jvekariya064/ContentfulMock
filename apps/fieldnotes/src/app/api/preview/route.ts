import { timingSafeEqual } from 'node:crypto';
import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';
import { NextResponse, type NextRequest } from 'next/server';

import { getArticleById, getArticleBySlug, getSiteByKey, isLang, langOfLocale } from '@blog/contentful';
import type { Lang } from '@blog/contentful';

import { SITE_KEY } from '@/site';

/**
 * Enters draft mode, then redirects to the article being previewed.
 *
 *   /api/preview?secret=…&id={entry_id}&locale={locale}   ← what Contentful calls
 *   /api/preview?secret=…&slug=…&lang=en                  ← convenient by hand
 *
 * The entry-id form exists because Contentful's preview URL tokens cannot follow
 * the `site` reference, so the entry cannot tell the URL which app owns it.
 *
 * Because both apps read one space, this route must check the article actually
 * belongs to THIS site — otherwise Meridian would happily preview a Fieldnotes
 * article at a Meridian URL that 404s once you leave preview.
 *
 * Three things keep it safe:
 *   - the secret is compared in constant time, so it is not an oracle
 *   - the redirect target is rebuilt from validated content, never echoed from
 *     the query string, so it cannot become an open redirect
 *   - draft mode is disabled again on every failure path
 */

function secretMatches(provided: string | null): boolean {
  const expected = process.env.CONTENTFUL_PREVIEW_SECRET;
  if (!expected || !provided) return false;

  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;

  if (!secretMatches(params.get('secret'))) {
    return new NextResponse('Invalid preview secret.', { status: 401 });
  }

  const entryId = params.get('id');
  const slug = params.get('slug');

  const langParam = params.get('lang');
  const lang: Lang = langParam && isLang(langParam) ? langParam : langOfLocale(params.get('locale'));

  if (!entryId && !slug) {
    return new NextResponse('Expected either an id or a slug.', { status: 400 });
  }

  // Draft mode has to be on before the lookup, or the preview client is never
  // used and an unpublished article looks like a 404.
  const draft = await draftMode();
  draft.enable();

  const fail = (message: string, status: number) => {
    draft.disable();
    return new NextResponse(message, { status });
  };

  let article;
  if (entryId) {
    article = await getArticleById(entryId, lang);
  } else {
    const site = await getSiteByKey(SITE_KEY, lang);
    article = site ? await getArticleBySlug(site.sys.id, slug!, lang) : null;
  }

  if (!article) return fail('No matching article — it may have been deleted.', 404);

  const owner = article.fields.site?.fields?.key;
  if (!owner) return fail('Article has no resolvable site reference.', 409);

  if (owner !== SITE_KEY) {
    return fail(
      `That article belongs to "${owner}", not "${SITE_KEY}". Open it in the ${owner} app instead.`,
      404,
    );
  }

  redirect(`/${lang}/articles/${article.fields.slug}`);
}
