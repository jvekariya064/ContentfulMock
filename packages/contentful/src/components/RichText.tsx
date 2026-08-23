import { BLOCKS, INLINES, type Document } from '@contentful/rich-text-types';
import { documentToReactComponents, type Options } from '@contentful/rich-text-react-renderer';
import type { Asset } from 'contentful';

import { ContentfulImage } from './ContentfulImage';

/**
 * Renders a Contentful rich text document.
 *
 * The node-to-component map is the whole point of storing rich text as a tree:
 * this is where the document meets the design system. Swap the map and the same
 * content renders somewhere else entirely.
 *
 * Nodes not listed here fall back to the renderer's sensible defaults.
 */

type EmbeddedAsset = Asset<'WITHOUT_UNRESOLVABLE_LINKS', string> | undefined;

const options: Options = {
  renderNode: {
    [BLOCKS.HEADING_2]: (_node, children) => (
      <h2 className="mt-10 mb-3 text-2xl font-semibold tracking-tight text-balance">{children}</h2>
    ),
    [BLOCKS.HEADING_3]: (_node, children) => (
      <h3 className="mt-8 mb-2 text-lg font-semibold tracking-tight text-balance">{children}</h3>
    ),
    [BLOCKS.HEADING_4]: (_node, children) => (
      <h4 className="mt-6 mb-2 text-base font-semibold">{children}</h4>
    ),
    [BLOCKS.PARAGRAPH]: (_node, children) => <p className="my-4 leading-relaxed">{children}</p>,
    [BLOCKS.UL_LIST]: (_node, children) => (
      <ul className="my-4 list-disc space-y-1 ps-6">{children}</ul>
    ),
    [BLOCKS.OL_LIST]: (_node, children) => (
      <ol className="my-4 list-decimal space-y-1 ps-6">{children}</ol>
    ),
    [BLOCKS.LIST_ITEM]: (_node, children) => <li className="[&>p]:my-0">{children}</li>,
    [BLOCKS.QUOTE]: (_node, children) => (
      <blockquote className="my-6 border-s-2 border-[color:var(--accent)] ps-5 text-lg italic text-neutral-600 dark:text-neutral-300 [&>p]:my-0">
        {children}
      </blockquote>
    ),
    [BLOCKS.HR]: () => <hr className="my-10 border-neutral-200 dark:border-neutral-800" />,

    // An embedded asset is a link like any other — with withoutUnresolvableLinks
    // it is either the resolved asset or undefined, never a raw stub.
    [BLOCKS.EMBEDDED_ASSET]: (node) => {
      const asset = node.data.target as EmbeddedAsset;
      if (!asset?.fields?.file?.url) return null;

      return (
        <figure className="my-8">
          <ContentfulImage
            asset={asset}
            sizes="(max-width: 768px) 100vw, 768px"
            className="w-full rounded"
          />
          {asset?.fields?.title ? (
            <figcaption className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
              {String(asset.fields.title)}
            </figcaption>
          ) : null}
        </figure>
      );
    },

    [INLINES.HYPERLINK]: (node, children) => (
      <a
        href={node.data.uri}
        className="text-[color:var(--accent)] underline underline-offset-2"
        rel="noreferrer"
      >
        {children}
      </a>
    ),
  },
  renderMark: {
    code: (text) => (
      <code className="rounded border border-neutral-200 bg-neutral-100 px-1 py-0.5 font-mono text-[0.85em] dark:border-neutral-700 dark:bg-neutral-800">
        {text}
      </code>
    ),
  },
};

export function RichText({ document }: { document: Document }) {
  return <>{documentToReactComponents(document, options)}</>;
}
