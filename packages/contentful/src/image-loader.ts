'use client';

/**
 * Custom loader for next/image, wired up in next.config.ts.
 *
 * Contentful already is an image CDN — it resizes and re-encodes from query
 * parameters. Routing through Next's optimiser would mean resizing twice and
 * paying for it twice, so this loader hands the work to Contentful and lets
 * next/image keep doing what it is genuinely good at: generating the srcset,
 * reserving layout space, and lazy loading.
 *
 * It has to be a global loader rather than a `loader` prop, because a function
 * cannot be passed from a Server Component to next/image (a Client Component).
 * Anything that is not a Contentful asset passes through untouched.
 */

const CONTENTFUL_IMAGE_HOST = 'images.ctfassets.net';

export default function contentfulImageLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}): string {
  if (!src.includes(CONTENTFUL_IMAGE_HOST)) return src;

  const [base, existing] = src.split('?');
  const params = new URLSearchParams(existing);

  // If the caller pinned a crop (w + h + fit), the height has to scale with the
  // requested width or every srcset candidate above the base width gets a
  // progressively flatter crop — a 640x360 card becoming 3840x360.
  const baseWidth = Number(params.get('w'));
  const baseHeight = Number(params.get('h'));
  if (baseWidth > 0 && baseHeight > 0) {
    params.set('h', String(Math.round(width * (baseHeight / baseWidth))));
  }

  params.set('w', String(width));
  params.set('q', String(quality ?? 72));
  // AVIF where the browser supports it; Contentful falls back automatically.
  if (!params.has('fm')) params.set('fm', 'avif');

  return `${base}?${params.toString()}`;
}
