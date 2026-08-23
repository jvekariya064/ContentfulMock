import type { Asset } from 'contentful';

/**
 * Builders for Contentful Images API URLs.
 *
 * Contentful transforms images on demand from query parameters, so there is no
 * build step and no asset pipeline — the whole optimisation story is "ask for
 * the right URL". We use plain <img> with a srcset rather than next/image
 * because Contentful is already the image CDN; putting Next's optimiser in
 * front would mean resizing twice.
 */

type Options = {
  width?: number;
  height?: number;
  format?: 'avif' | 'webp' | 'jpg' | 'png';
  quality?: number;
  fit?: 'pad' | 'fill' | 'scale' | 'crop' | 'thumb';
};

type ImageAsset = Asset<'WITHOUT_UNRESOLVABLE_LINKS', string> | undefined;

/** Contentful returns protocol-relative URLs; browsers want a scheme. */
const absolute = (url: string) => (url.startsWith('//') ? `https:${url}` : url);

export function imageUrl(asset: ImageAsset, options: Options = {}): string | null {
  const file = asset?.fields?.file;
  if (!file?.url) return null;

  const params = new URLSearchParams();
  if (options.width) params.set('w', String(options.width));
  if (options.height) params.set('h', String(options.height));
  if (options.format) params.set('fm', options.format);
  if (options.quality) params.set('q', String(options.quality));
  if (options.fit) params.set('fit', options.fit);

  const query = params.toString();
  return query ? `${absolute(file.url)}?${query}` : absolute(file.url);
}

/** A srcset across sensible widths, so phones don't download desktop bytes. */
export function imageSrcSet(asset: ImageAsset, widths: number[], options: Options = {}): string {
  return widths
    .map((width) => {
      const url = imageUrl(asset, { ...options, width });
      return url ? `${url} ${width}w` : null;
    })
    .filter(Boolean)
    .join(', ');
}

/** The asset description doubles as alt text — see the alt-text article for why that's imperfect. */
export const imageAlt = (asset: ImageAsset): string =>
  (asset?.fields?.description as string | undefined) ??
  (asset?.fields?.title as string | undefined) ??
  '';

export function imageDimensions(asset: ImageAsset) {
  const image = asset?.fields?.file?.details?.image;
  return image ? { width: image.width, height: image.height } : null;
}
