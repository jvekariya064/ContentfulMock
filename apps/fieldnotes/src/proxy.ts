import { NextResponse, type NextRequest } from 'next/server';

import { isLang } from '@blog/contentful';

/**
 * Fills in the missing parts of a URL.
 *
 *   /        → /en/articles
 *   /ur      → /ur/articles
 *
 * There is no site segment: this app serves exactly one site.
 *
 * Next 16 renamed this file convention from `middleware` to `proxy`; the export
 * has to be named `proxy` to match.
 */

const DEFAULT_LANG = 'en';

export function proxy(request: NextRequest) {
  const segments = request.nextUrl.pathname.split('/').filter(Boolean);

  if (segments.length === 0) {
    return NextResponse.redirect(new URL(`/${DEFAULT_LANG}/articles`, request.url));
  }

  if (segments.length === 1 && isLang(segments[0])) {
    return NextResponse.redirect(new URL(`/${segments[0]}/articles`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Everything except API routes, Next internals, and files with an extension.
  matcher: ['/((?!api|_next/static|_next/image|.*\\..*).*)'],
};
