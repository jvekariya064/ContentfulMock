import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';
import type { NextRequest } from 'next/server';

/** Leaves draft mode and returns to the published version of the page. */
export async function GET(request: NextRequest) {
  const draft = await draftMode();
  draft.disable();

  const target = request.nextUrl.searchParams.get('redirect');

  // Only same-origin paths. "//evil.com" is a valid protocol-relative URL, so
  // checking for a leading slash alone is not enough.
  const safe = target && target.startsWith('/') && !target.startsWith('//') ? target : '/';

  redirect(safe);
}
