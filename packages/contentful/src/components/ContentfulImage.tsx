import Image from 'next/image';
import type { Asset } from 'contentful';

import { imageAlt, imageDimensions, imageUrl } from '../image';

type ImageAsset = Asset<'WITHOUT_UNRESOLVABLE_LINKS', string> | undefined;

/**
 * next/image over a Contentful asset.
 *
 * `fit`/`height` are baked into the base URL so the crop is fixed; width and
 * format are appended per-candidate by the loader when it builds the srcset.
 * Returns null rather than a broken image when the asset link did not resolve.
 */
export function ContentfulImage({
  asset,
  sizes,
  className,
  aspect,
  priority = false,
  alt,
}: {
  asset: ImageAsset;
  sizes: string;
  className?: string;
  /** Crop to this ratio instead of using the asset's own dimensions. */
  aspect?: { width: number; height: number };
  priority?: boolean;
  alt?: string;
}) {
  const natural = imageDimensions(asset);
  const dimensions = aspect ?? natural;

  const src = imageUrl(asset, aspect ? { ...aspect, fit: 'fill' } : {});
  if (!src || !dimensions) return null;

  return (
    <Image
      src={src}
      alt={alt ?? imageAlt(asset)}
      width={dimensions.width}
      height={dimensions.height}
      sizes={sizes}
      priority={priority}
      className={className}
    />
  );
}
